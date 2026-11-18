# THE OFFICE — Deep Code Audit

**Scope:** `the-office-web` @ `7bfe8cd` (branch `arena/a7e1d1d1-the-office-web`)
**Date:** 2026-11-18
**Method:** full read of all 27 source files + empirical verification (`tsc`, `vite build`,
production CSS inspection, dev-server HTTP probes, contrast computation, Zod behaviour tests).

---

## 0. Baseline health

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **PASS** — 0 errors, strict mode, `noUnusedLocals`, `noUnusedParameters` |
| `npm run build` | **PASS** — 44 modules, 1.47 s |
| Bundle | `index.js` 274.3 kB (≈83.5 kB gz) + `vendor.js` 11.3 kB (≈4.1 kB gz) |
| Runtime errors on load | none observed (dev server 200 on `/`, `#/privacy`, `/terms`, `/notes`, any path) |
| Test coverage | **none** — no test runner, no test files |
| CI | **none** — no `.github/`, no lint/type-check gate |
| Lint config | **none** — ESLint disabled via comments in 3 files but ESLint itself is not installed |

The codebase is small (**2,999 lines**), unusually well-organised for its size, and genuinely
readable. The problems are concentrated in **the contact-form delivery path**, **the build
configuration**, and **consistency/maintainability**, not in the markup.

---

## 1. What is genuinely strong

1. **Editorial visual system.** Single accent-free palette (`src/index.css` `@theme`), Fraunces /
   Inter Tight / JetBrains Mono, structural hairlines (`.rule-t/.rule-b`), and a manuscript-gallet
   metaphor (`SEC. / PORTFOLIO / RUNNING HEAD / MARGINALIA`) that is unusual and distinctive.
   This is the site's biggest asset — preserve it.
2. **`MobileFolioStrip`** keeps the signature layout device alive below `lg` instead of dropping the
   concept. That is a legitimately thoughtful responsive decision.
3. **Accessibility fundamentals.** Correct `aria-labelledby` on every section, `aria-invalid` +
   `aria-describedby` + `role="alert"` on form errors, `aria-live="polite"` on the submit status,
   decorative animation correctly `aria-hidden`, real `:focus-visible` ring, and a global
   `prefers-reduced-motion` block.
4. **No `dangerouslySetInnerHTML` anywhere.** React escaping is the only text sink.
5. **`ErrorBoundary`** wraps the whole app with an in-voice fallback.
6. **`noscript`** fallback in `index.html` is the most on-brand error state on the site — most
   React sites ship a blank page.
7. **Server-side validation is real** (Zod), with honeypot + IP rate limiting + HTML stripping.
   Defence-in-depth is understood here.
8. **Semantic metadata**: canonical, OG/Twitter cards, `ProfessionalService` JSON-LD,
   `robots.txt`, `sitemap.xml`.

---

## 2. Critical defects

### C1 — The Studio appears to confirm briefs that were never delivered
**Files:** `api/brief.ts:122-128`, `api/brief.ts:166-179`, `api/brief.ts:196`

Three separate paths return `200 { success: true }` when delivery **failed or never happened**:

| Path | Line | Actual outcome |
|---|---|---|
| Web3Forms returns `json.success === false` | `122` | falls through to the dev-log branch, returns **success** |
| Resend returns `result.error` | `166` | logs the failure, **still returns success** |
| Resend throws | `175` | **returns success** |
| No provider configured | `196` | logs to console, **returns success** |

The user sees `RECEIVED. WE REPLY WITHIN TWO WORKING DAYS.` and the brief is gone. For a studio
whose entire pitch is *"we reply to every brief within two working days"*, this is the single most
damaging bug in the repository. Contact-form leads lost silently. **P0.**

### C2 — `submitBrief()` can never return a `400`/`429`, so all that error UI is dead code
**File:** `src/lib/api.ts:120-145`

The fallback request is issued, parsed, and then — if `!res.ok` — **executed into nothing**. The
`if (res.ok) return data;` at line 135 has no `else`. Control always falls to the unconditional
`throw new ApiError(..., 500)` at line 142.

Consequences:
- `App.tsx:452` `if (err.status === 429)` — **unreachable**
- `App.tsx:454` `if (err.status === 400 && err.issues)` — **unreachable**, so server-side Zod
  field errors never reach the form; the user only ever gets a generic toast
- The user is told *"unable to send… please email us directly"* even when the server replied
  `"Too many requests. Please try again in 15 minutes."` — advice that is wrong.

**P0** (it destroys the only meaningful error recovery path).

### C3 — Every successful brief can be delivered **twice**
**File:** `src/lib/api.ts:101-108` vs `api/brief.ts:96-134`

Layer 1 posts to Web3Forms **and**, on success, fires a fire-and-forget `POST /api/brief`
("Also notify backend in the background"). That endpoint's *first* action is to post to the
*same* Web3Forms inbox. Result: duplicate emails per submission, plus double consumption of the
5-per-15-minute rate-limit budget. The team cannot tell duplicates from genuine repeat enquiries.

Related, same file: `if (data && (data.success || res.ok))` at line 101 treats a bare `200` as
success without checking the body — while `api/brief.ts` *also* returns `200` on failure (C1).
The two leniencies compound.

### C4 — `react-dom` is not in the vendor chunk (the code-splitting is a no-op)
**File:** `vite.config.ts:76-82`

```ts
manualChunks: { vendor: ["react", "react-dom"] }
```

Measured output: `vendor-ByNFwixe.js` = **11.3 kB** and contains **zero** occurrences of
`react-dom`; `index-*.js` = **274 kB** and contains the full React DOM runtime. React 19's
internals resolve `react-dom` through `react-dom/client` + internal paths, so the literal module
specifier misses. The config reads as if vendor code is split; it isn't. Either fix it
(`manualChunks(id) => /node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id) ? "vendor" : undefined`)
or delete it.

### C5 — Production source maps are published
**File:** `vite.config.ts:75`

`build.sourcemap: true` emits `index-*.js.map` (**1.14 MB**) and `vendor-*.js.map` into `dist/`,
served publicly at `/assets/`. This exposes the full original TypeScript (including the hardcoded
Web3Forms key) and adds ~1.2 MB to a deploy whose JS is only 285 kB. Set to `"hidden"` or `false`.

### C6 — Repository bloat: the 4.8 MB PDF is committed twice
`Marketing_Impact_Report_Roy_Amazon_SEO_2026.pdf` and
`public/downloads/amazon-seo-sample-report.pdf` are **byte-identical** (`md5 2bd474d…`, 4,957,723 B
each). The root copy is never referenced by the app — it is pure repo weight and is served by
nobody. Delete the root duplicate.

### C7 — The Web3Forms access key is hardcoded in three places
`src/lib/api.ts:9`, `api/brief.ts:14`, `.env.example:8` (a committed example file carrying a live
key). The key ships in the client bundle (verified) — which is inherent to Web3Forms' browser
design and acceptable **if** it is domain-restricted. But it is committed, unrotatable without a
redeploy in three places, and duplicated. Consolidate to one env var (`VITE_WEB3FORMS_KEY`) and
document the dashboard domain allow-list. Also: the key's abuse blast radius is your inbox, so
enable Web3Forms' spam protection.

---

## 3. High-severity issues

### H1 — The hero's primary CTA is gated on a decorative animation
**File:** `src/App.tsx:977`

```tsx
heroDone ? "opacity-100" : "opacity-0 pointer-events-none"
```

`heroDone` is only set by `Typewriter`'s `onDone`, which fires after `startDelay` (600 ms) **plus**
`text.length × speed` (66 chars × 28 ms = 1,848 ms) — **2.45 s for every visitor**, and only if the
Typewriter mounts and completes. Until then the hero's only CTA is invisible *and*
`pointer-events-none`. If `matchMedia` is unavailable or the component errors, the CTA can remain
permanently unreachable. A primary conversion element must never depend on a non-essential
animation. Render it immediately; animate its *appearance*, not its existence.

### H2 — Only the 404 page has a `<main>`; the homepage and all content pages do not
`<main>` exists at `src/App.tsx:775` (the `NotFound` component) and **nowhere else**. The homepage
sections (`#top`, `#services`, `#work`, `#about`, `#contact`) sit inside a bare `<div>`; the three
content pages use `<main>` correctly. Wheelchair/screen-reader users lose the primary landmark on
the site's most important page.

### H3 — No skip link
Zero occurrences of a skip-to-content link in any page. With the persistent manifest bar +
header nav + margin rail, keyboard users must tab through the chrome on every load.

### H4 — The "scroll reveal" system is dead code
**Files:** `src/App.tsx:724-740`, `src/index.css:104-112`

`useReveal()` queries `.reveal` and adds **`is-visible`**; the stylesheet defines **`.in`**.
Furthermore **no element on the site carries the `.reveal` class**, so the observer attaches to
nothing. Two bugs that cancel out — the CSS `.reveal { opacity: 0 }` is inert only because nothing
applies it. Anyone who later adds `className="reveal"` to a section will make that section
**permanently invisible**. Delete the hook, or wire class names correctly.

### H5 — `color-scheme: light dark` on a light-only design will make the `<select>` unreadable
**File:** `index.html:9` (with `src/App.tsx:521-544`)

The site is a hard-coded white-on-black design with **no dark theme** (`index.html` even ships
the opposite `theme-color` hints). Declaring `color-scheme: light dark` tells the browser to theme
**UA-controlled widgets** for the OS preference. The `#service` `<select>` sets
`bg-transparent` + `text-white`; its `<option>`s are styled `className="text-black"` — but
option rendering is owned by the OS/browser. On a dark-mode OS the control can render a dark
popup with dark text, or a light popup that overrides the intended colours. Either remove
`content="light dark"` or give the select an opaque `bg-white text-black` treatment.

### H6 — Contrast: `opacity-40`/`opacity-50` text fails WCAG AA
Computed against `#000` on `#fff`:

| Utility | Effective colour | Ratio | AA (4.5:1) |
|---|---|---|---|
| `opacity-60` | `#666` | 5.74:1 | pass |
| `opacity-50` | `#808080` | **3.95:1** | **fail** |
| `opacity-40` | `#999` | **2.85:1** | **fail** |

Measured usage: `opacity-40` on the character counter (`App.tsx:558`), `opacity-50` on the
`MarginRail` labels `SEC.` / `PORTFOLIO` / `RUNNING HEAD` / `MARGINALIA` (4×) and on
`MobileFolioStrip` separators. The `MarginRail` labels are 11 px mono — already small — and are
the *only* labels for their values. (They are `aria-hidden`, so screen readers are unaffected, but
sighted low-vision users are.) In inverse sections `opacity-50` on white is 5.32:1 — passes; the
failure is light-mode only.

### H7 — The honeypot never leaves the browser on the primary delivery path
**Files:** `src/lib/api.ts:74-96`, `src/App.tsx:583-600`

The client collects `company_website` (`App.tsx:427`) and the server has a honeypot check
(`api/brief.ts:70-77`). But **`submitBrief()` never forwards that field**: the Layer-1 Web3Forms
body (`api.ts:79-95`) omits it, and the Layer-2 fallback posts `payload` **including** it — but
Layer 2 is only reached when Web3Forms fails. So on the path that actually runs (Layer 1, ~all
traffic), the honeypot is discarded before it reaches any validator, and the bot-defence is
Web3Forms' own. The field itself is correctly `display:none` + `aria-hidden` + `tabIndex={-1}`,
so it does not affect humans — this is a *silently defeated control*, not a visual bug.

### H8 — `/api/health` is guaranteed to be `503` in the intended deployment
**File:** `api/health.ts:16`

```ts
const healthy = checks.resend && checks.toEmail;
```

The site's documented and actual delivery path is **Web3Forms**; `RESEND_API_KEY` is explicitly
optional (`.env.example`). In a correctly-configured Web3Forms-only deployment,
`checks.resend === false` → always `503 degraded`. Uptime monitors will page forever. The health
check must assert the *actual* configured provider.

### H9 — CORS reflects any origin
**File:** `api/brief.ts:17`

```ts
const origin = (req.headers.origin as string) || "*";
res.setHeader("Access-Control-Allow-Origin", origin);
```

Full reflection of arbitrary origins. (No credentials are used, so this is not a session-theft
vector, but it does let any third-party page drive your rate-limit budget and inbox.) README still
instructs the operator to set a `CORS_ORIGIN` constant that **does not exist** in the code.
Allow-list instead.

### H10 — `npm run vercel:dev` fails out of the box
`package.json` `vercel:dev` runs `vercel dev`, but the Vercel CLI is not a dependency and is not
installed. README's "to test the API locally, use `npm run vercel:dev`" is broken on a clean clone.

---

## 4. Medium-severity issues

### M1 — No per-route document title, description, or canonical
`index.html` hardcodes the homepage `<title>`, `og:url`, `og:image` and canonical
`https://theoffice.studio/`. `/privacy`, `/terms`, `/notes` therefore all share the homepage
title in the tab, share history/bookmarks, and are **canonically declared to be the homepage** —
which suppresses their indexing. No `document.title` is ever set (`grep` = 0 results). Every page
also ships `og:image:width=1200`/`height=630` while the actual asset is **1424 × 752**.

### M2 — ~87 kB of legal and essay prose is in the main entry chunk
The main `index.js` ships `TermsPage`, `PrivacyPage`, and all four long essays from
`src/data/notes.ts` (verified by grep in the built bundle: "KEY TAKEAWAY", "Terms of service"
both present). A visitor on the homepage downloads every legal paragraph and ~2,000 words of
essays before first paint. `React.lazy` on the three routes is a ~10-line change.

### M3 — Header/footer markup is duplicated across four page files
The `THE OFFICE ®` lockup is hand-written **5×** (`App.tsx:763`, `App.tsx:883` in `NotFound`,
`NotesPage:25`, `PrivacyPage:17`, `TermsPage:17`) and the `PRIVACY / TERMS` footer nav **3×**.
The four page files each re-implement the header, and three re-implement the footer, with small
divergences already present (the homepage nav has 4 items + a CTA; the legal pages have 1; the
notes page has 4). Any nav change is a 4-file edit with a real chance of drift. Extract
`components/SiteHeader.tsx` and `components/SiteFooter.tsx`.

### M4 — Router is a hand-rolled path switch that leaks trailing slashes
`src/App.tsx:836-863`. `/notes/` (very common inbound shape), `/privacy/` and `/terms/` all fall
to **404** because the comparison is exact string equality. Anchor links from `/notes` back to the
homepage are written as `/ #services` — full page reload — which is correct, but the homepage's own
`href="#services"` combined with `<base>`-less absolute routing means no `aria-current` and no
active-nav state anywhere (0 occurrences).

### M5 — Type scale is 10–11 px in **63 places**
`text-[11px]` × 47, `text-[10px]` × 10, `text-[10.5px]` × 6. 11 px mono for primary UI labels
(nav, buttons, section labels, form labels) is below every common minimum-recommended body size
and is the single most likely cause of the site *feeling* precious rather than confident on
mobile. Recommend a floor of 12 px for interactive/labelling text and a token
(`--text-micro`) so the scale is one decision, not 63.

### M6 — `tracking-mono` is *negative* tracking applied to uppercase micro-text
`src/index.css:87-89`: `.tracking-mono { letter-spacing: -0.01em }`, used **77×** — almost always
on `font-mono` **uppercase** labels (`tracking-mono` + `font-mono text-[11px]`). Small caps text
needs *positive* tracking for legibility; `.tracking-meta` (`+0.08em`) exists and is used **0
times**. This is a global legibility regression dressed as a utility name.

### M7 — Dev server leaks briefs to stdout and mis-routes
`vite.config.ts:35` `console.log("[Dev Server] Brief received:", data)` prints **name, email, org,
and the full brief** to the terminal (and to any captured logs). `vite.config.ts:15,27` match with
`req.url === "/api/health"` — strict equality, so `/api/brief?x=1` and trailing-slash forms hit the
SPA instead. The middleware also **always** returns success without validation, so it actively
masks C1 during development.

### M8 — `ENABLE_DEV_EMAIL` is documented but never read
`.env.example:20` advertises `ENABLE_DEV_EMAIL=true`; `grep` across the repo finds **0** references
outside the example file. Dead configuration with security implications (it implies email can be
disabled in dev; it cannot).

### M9 — "Draft" copy is shipping to production
`src/App.tsx:1342` — **"Detailed address withheld from this draft."**
`src/App.tsx:1046` — marginalia prefixed **"A3 / B7:"** (internal annotation IDs leaked into copy)
`src/App.tsx:1000/1122/1196` — **"Illustrative · composite from past engagements"** and
**"Names & specifics generalised"** on testimonials and case studies, and
`ManifestBar.tsx:55` renders **`ACTIVE 142 —IL`**, an invented "rolling indicator".

Individually honest; together they tell a prospective client *"this portfolio is not real."* The
site's differentiator is **trust**, and this is the section that spends it. Decide: either present
real anonymised work (as the PDF does) or remove the numbers/testimonials entirely. Do not ship
placeholders with asterisks.

### M10 — The cookie notice is decorative
`App.tsx:1394-1424` promises *"We use minimal analytics… No surveillance, no third-party
trackers."* **There is no analytics script in `index.html`** and `track()` (`App.tsx:161-174`) has
no sink — it silently no-ops in production (`window.track` and `window.dataLayer` are never
defined; the `console.debug` branch is `import.meta.env.DEV`-only). So: (a) no data is collected at
all, and (b) the notice asks consent for something that doesn't happen. Either add the analytics
you claim or drop the notice. (As written it's also a UX tax on every visitor — a fixed bottom bar
that overlaps the toast container at `Toast.tsx:14` `bottom-6`.)

### M11 — Dead exports / unused variants
`checkHealth()` (`src/lib/api.ts:148`) — 0 call sites. `formRef` (`App.tsx:354`) — bound to the
form but never read. CSS utilities never used in any TSX: `.grid-rule`, `.rule-r`, `.rule-l`,
`.tracking-meta`, `.font-sans-tight`, `--color-paper-tint`, `--color-mute`, `--color-faint`.
`MAX_RETRIES` retries only on *non-abort* network errors — which is the correct behaviour — but
the retry has no jitter/backoff and re-POSTs a non-idempotent endpoint (duplicate-brief risk).
`setTimeout(() => setStatus("idle"), 6000)` (`App.tsx:444`) is never cleared on unmount.

### M12 — `sanitizeText` doesn't do what its comment claims
`api/_lib/validate.ts:57-63` strips `<...>` and normalises newlines. It does **not** escape
`&`, `"`, `'`, and it is applied *after* validation — so a payload of 5,000 `<` characters passes
Zod and becomes an empty brief that is still emailed. Fine for plain-text email, but the comment
("Basic XSS sanitization") overstates it and the ordering lets a valid-looking empty submission
through.

### M13 — Zod `.min()` runs **before** `.transform(trim)`
`api/_lib/validate.ts:6,47`. Verified empirically:

```
whitespace-only name+brief -> PASSES (BUG)
name 2 spaces + brief 3 spaces -> PASSES (BUG)
```

A submission of `"   "` / `"   "` passes validation, arrives as an empty email, and returns
`200 success`. Move `.trim()` before the length checks (`z.string().trim().min(1)`) or
`preprocess`.

---

## 5. Low-severity / polish

| # | Issue | Where |
|---|---|---|
| L1 | **OG image dimensions lie** — declared 1200×630, actual 1424×752 (og-image.png) | `index.html:24-25` |
| L2 | `favicon.png` ships `sizes="64x64"` but is **1024×1024**, 208 kB for a favicon; `apple-touch-icon` is an SVG (iOS ignores SVG touch icons) | `index.html:14-15` |
| L3 | The Fraunces stylesheet is preloaded **as a stylesheet** (`rel="preload" as="style"`) 3 lines before the identical `rel="stylesheet"` — it preloads no font, saves no round-trip, and simply duplicates a request the blocking stylesheet already makes | `index.html:68-77` |
| L4 | 3 separate Google Fonts requests on the critical path; self-hosting (or at least `font-display: swap` + one combined request) removes a third-party dependency and ~2 RTTs | `index.html:68-80` |
| L5 | `ManifestBar` runs two `setInterval`s forever: a 1 Hz clock and a **12 ms** count-up to 142 (≈1.7 s of 83 fps state updates) that then clears. The count is fictional (see M9) — delete the animation, keep the clock | `ManifestBar.tsx:16-38` |
| L6 | No `<main>` on home (H2), **no skip link** (H3), **no `aria-current`** on nav (M4) | `src/App.tsx` |
| L7 | `route` state never updates on in-app link clicks (all links are plain `<a href>` → full page reload), so the router only ever matters for the initial pathname + back button. It also has no 404 status code (soft-404) | `App.tsx:836-863` |
| L8 | The `#service` `<select>` lacks `aria-invalid` / `aria-describedby="service-err"`, unlike the `Field` component which does it correctly — so its validation error is announced by `role="alert"` but not associated with the control | `App.tsx:521-548` |
| L9 | `aria-live="polite"` container at `App.tsx:609` is rendered **once with static content**; status changes replace text inside it, which mostly works, but the error message also fires a toast with `role="status"` — double announcement | `App.tsx:609`, `Toast.tsx:20` |
| L10 | `®` is rendered as superscript typography on the wordmark (5 occurrences). If the mark is not actually registered, using `®` is a legal exposure in most jurisdictions; if it is, note that it is styled so small (`text-[10px] opacity-60`) it reads as a design flourish | `App.tsx:763` + 4 more |
| L11 | `.gitignore` covers `dist` and `.env` correctly, but nothing prevents source maps or large binaries from being committed — which is exactly what happened with the duplicated 4.8 MB PDFs (C6) | `.gitignore` |
| L12 | No `LICENSE`/`SECURITY.md`; `original_msg.eml` (68 kB, containing a real person's name and email) is committed to the repo root | repo root |
| L13 | `useReveal` uses `e.target.classList.add` (imperative DOM mutation) inside React — see H4; the same hook is the only `querySelectorAll` in the app | `App.tsx:729` |
| L14 | `Toast` container is `z-[100]` but the cookie bar is `z-40` and sits at `bottom-0`; on mobile the cookie bar covers the last ~72 px of content permanently until dismissed | `App.tsx:1404`, `Toast.tsx:14` |
| L15 | `favicon.png` 208 kB and `og-image.png` 224 kB are unoptimised; `og-image` should be ≤ 200 kB and exactly 1200×630 | `public/` |
| L16 | `vercel.json` sets `X-XSS-Protection: 1; mode=block` — deprecated, can introduce vulnerabilities in old browsers, and is ignored by modern ones; drop it. No `Strict-Transport-Security`, no `Content-Security-Policy` for the page itself (only on the API response) | `vercel.json:24-27` |
| L17 | `api/health.ts` sets `Cache-Control: no-store` (good) but the JSON API responses from `/api/brief` set none | `api/brief.ts` |
| L18 | The 404 page's `ManifestBar` count and clock still run — harmless. Note the 404 is client-side only so a static Vercel deploy also returns `200` for unknown paths (an SPA soft 404): there is no `noindex` and no server-side status signal | `App.tsx:762` |

---

## 6. Architecture assessment

```
Strength:    small surface area, typed end-to-end, sensible api/_lib split, zero runtime deps
             beyond React + clsx/tailwind-merge/zod.
Weakness:    the *frontend delivery layer* (src/lib/api.ts) is the only piece with real logic,
             and it is the piece that fails: 3 delivery layers, none of which reports failure
             correctly, and all of which can double-send.
Risk:        App.tsx is 1,433 lines / 53 kB with 5 components + 4 datasets + a router + 2 hooks
             inline. It is the file that will fight every future change.
```

**Recommended structural change (in priority order):**

1. Delete Layer-1 browser delivery **or** the Layer-2 backend fallback. One delivery path, one
   truth. (Prefer: browser → Web3Forms only, with `VITE_WEB3FORMS_KEY`; delete `api/brief.ts`,
   `api/_lib/*`, `resend`, and the `/api/health` fiction. This removes ~450 lines, two secrets,
   the CORS surface, the rate-limiter's cold-start caveat, and C1/C3/H8/H9 outright.)
2. If the backend stays: fix C1 (return 502/500 on failure), C2 (handle `!res.ok`), C3 (don't
   double-post), H8 (health = configured provider), H9 (allow-list origins).
3. Extract from `App.tsx`: `data/` (services, projects, principles, testimonials, team),
   `components/SiteHeader.tsx`, `components/SiteFooter.tsx`, `components/ContactForm.tsx`,
   `pages/HomePage.tsx`, `pages/NotFoundPage.tsx`, `hooks/useReveal.ts` (or delete it).
4. `React.lazy` the three content routes (M2).
5. Add Playwright + a `test` script; add a CI workflow running `tsc --noEmit` + `vite build`.
   There is currently **no** automated protection against any of the above regressing.

---

## 7. Prioritised action list

| Pri | Action | Effort | Impact |
|---|---|---|---|
| **P0** | Return a real error from `api/brief.ts` on delivery failure (C1) | 15 min | Stops silent lead loss |
| **P0** | Handle `!res.ok` in `submitBrief()` so 400/429 surface (C2) | 10 min | Restores all error UI |
| **P0** | Remove the duplicate background POST (C3) | 5 min | Ends duplicate emails |
| **P0** | `.trim()` before `.min()` in Zod (M13) | 5 min | Blocks empty submissions |
| **P1** | Fix or delete `manualChunks` (C4); `sourcemap: "hidden"` (C5) | 10 min | Real vendor split, −1.1 MB deploy |
| **P1** | Remove the hero CTA animation gate (H1) | 5 min | CTA reachable at t=0 |
| **P1** | Add `<main>` + skip link to the homepage (H2, H3) | 15 min | Landmark navigation |
| **P1** | Fix/delete `useReveal` `.reveal`/`.is-visible` mismatch (H4) | 10 min | Removes a landmine |
| **P1** | Remove `color-scheme: light dark` or fix the `<select>` (H5) | 5 min | Unreadable-control fix |
| **P1** | Health check reflects Web3Forms (H8); CORS allow-list (H9) | 15 min | Correct monitoring |
| **P1** | Delete the duplicate 4.8 MB PDF (C6) | 2 min | −4.8 MB repo |
| **P2** | Per-route `<title>`/canonical (M1); `React.lazy` routes (M2) | 1 h | SEO + −40 kB |
| **P2** | Raise `opacity-40/50` to ≥60 on text (H6); 12 px floor (M5); fix `tracking-mono` (M6) | 2 h | AA compliance + legibility |
| **P2** | Extract SiteHeader/SiteFooter/data out of `App.tsx` (M3) | 3 h | Maintainability |
| **P2** | Resolve the "illustrative/draft" copy (M9) — the biggest *trust* issue, not a code bug | decision | Conversion |
| **P3** | Self-host fonts, optimise OG/favicon, drop `X-XSS-Protection`, remove dead CSS/exports | 3 h | Performance + hygiene |
| **P3** | Playwright + CI type-check (no test safety net at all today) | 1 day | Regression protection |

---

## 8. One-paragraph verdict

This is a **well-designed, cleanly-typed marketing site whose only non-trivial subsystem — the
brief pipeline — is confidently wrong**. The visual system, semantics, and reduced-motion care are
above the standard for a studio site; the build config contains a no-op split and publishes source
maps; and the contact path can acknowledge, silently drop, and double-deliver the same enquiry
while the entire error-handling UI it was built to support is unreachable. None of these are
architectural problems — the P0 set is roughly **35 minutes of work** across four files — but until
they are fixed, the site is telling prospective clients it received briefs it never got.
