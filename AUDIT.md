# THE OFFICE — Project Audit & Gap Report

Audit date: 2026-08-26 · Branch: `arena/01a03b70-the-office-web` · Base commit: `7bfe8cd`
Source of requirements: `original_msg.eml` (From: Morrison Desmond <desmondmorrisonx@gmail.com>,
Date: Tue, 25 Aug 2026 16:47:15 -0400, Subject: *(empty)*, To: The office Techies
<theofficetechies@gmail.com>). The message is a 19-phase brief to "deeply audit, refine,
expand, and professionally complete" the site at `https://the-office-test4.vercel.app/`.

---

## 1. What the project actually is (verified)

Single-page React 19 + Vite 7 + Tailwind 4 site with a Vercel serverless backend.

| Layer | File(s) | State |
|---|---|---|
| Entry HTML / SEO | `index.html` (5.6 KB) | title, description, canonical, OG, Twitter, JSON-LD `ProfessionalService`, noscript fallback, Fraunces/Inter Tight/JetBrains Mono |
| App shell | `src/App.tsx` (1,433 lines) | ManifestBar → header → Hero → Services → Work → About(+principles+team+testimonials) → Contact → footer → cookie notice |
| Components | `src/components/` (6 files) | ManifestBar, MarginRail, MobileFolioStrip, Typewriter, Toast, ErrorBoundary |
| Routes | `src/App.tsx:837-866` | client-side `window.location.pathname` switch: `/`, `/privacy`, `/terms`, `/notes`, else `<NotFound/>` |
| Pages | `src/pages/` | NotesPage (accordion, 3 essays), PrivacyPage (117 L), TermsPage (119 L) |
| Data | `src/data/notes.ts` | 3 notes with slug/date/category/paragraphs/keyTakeaway |
| Frontend email client | `src/lib/api.ts` | Web3Forms direct POST, then `/api/brief` fallback |
| Backend | `api/brief.ts`, `api/health.ts`, `api/_lib/{rate-limit,validate}.ts` | Zod validation, IP rate limit (5/15 min), honeypot, tag stripping, Web3Forms → Resend → console fallback |
| Static | `public/` | favicons, og-image, robots.txt, sitemap.xml, `downloads/amazon-seo-sample-report.pdf` (4.9 MB) |

Checks I actually ran this session:

- `npx tsc --noEmit` → exit 0, no diagnostics (tsconfig includes `src`, `api`, `vite.config.ts`).
- `npm run build` → success. `dist/index.html` 5.80 kB, `index-*.css` 25.61 kB, `vendor-*.js` 11.26 kB, `index-*.js` **274.33 kB** (83.5 kB gzip).
- `npm run dev` → up on `0.0.0.0:5173`; `GET /` → 200; `GET /api/health` → `{"status":"ok",...,"checks":{"dev":true}}`; `POST /api/brief` → `{"success":true,...}`.
- `git status` → clean tree.

Not verified (I could not run these here): production deploy on Vercel, live delivery of a
Web3Forms email into the Gmail inbox, Lighthouse/Core Web Vitals, screen-reader pass, and
rendering at real breakpoints (no headless browser installed — `playwright` and `chromium`
are both absent from this sandbox).

---

## 2. Phase-by-phase status against the brief

| # | Phase in the email | Status | Evidence |
|---|---|---|---|
| — | Preserve existing UI/UX foundation | **Done** | Editorial mono/display grid system, MarginRail, ManifestBar intact and reused on every route |
| 1 | Complete website audit | **Not in repo** | No audit artefact exists. This file is the first one |
| 2 | Distinct brand system | **Partial** | Type system is strong; colour system is not — see §3.1 |
| 3 | Hero experience | **Done** | `src/App.tsx:925-990`: headline, sub-copy, typewriter proof line, primary CTA |
| 4 | Complete service system | **Partial** | 4 services exist (`src/App.tsx:18-67`) with blurb + deliverables only. The brief asks each service to state *who needs it*, *the problem it solves*, *the process*, *expected outcomes* — none of those fields exist |
| 5 | Process / methodology section | **NOT DONE** | `grep -i "process|approach|methodolog"` across `src/` returns one unrelated testimonial line (`src/App.tsx:158`). There is no 01–06 methodology section anywhere |
| 6 | Selected work system | **Partial** | 6 project cards (`src/App.tsx:69-125`) + one real PDF deliverable. No case-study pages, no per-project routes, cards are not links |
| 7 | "Why THE OFFICE" positioning | **Partial** | Only a 4-item `principles` box inside About (`src/App.tsx:126-143`). No dedicated positioning section; no "Why THE OFFICE" heading anywhere |
| 8 | Field notes / editorial system | **Partial** | `/notes` with 3 real essays exists. Essays are behind a JS accordion (`src/pages/NotesPage.tsx:60-115`) — no `/notes/:slug` URLs, no per-note metadata, none listed in `public/sitemap.xml` |
| 9 | Trust without fabrication | **At risk** | See §3.2 |
| 10 | Team section | **Violates the brief** | Four invented named identities with bios — see §3.2 |
| 11 | Premium contact experience | **Partial** | Name, email, org, one service, brief exist. **Timeline, scope, budget and discovery-source fields do not exist in the UI** even though the schema and API already accept them (`api/_lib/validate.ts:27-45`, `src/lib/api.ts:60-63`). Validation/error/success/loading states are all present |
| 12 | Navigation and footer | **Partial** | Desktop nav is SERVICES / WORK / ABOUT / CONTACT only (`src/App.tsx:887-903`) — no Approach, no Notes. **There is no mobile menu at all**: under `md` the nav is replaced by a single "BRIEF →" link (`src/App.tsx:905-910`) |
| 13 | Design system | **Partial** | Spacing/grid/type are consistent. Colour tokens for the requested palette are declared and unused — see §3.1 |
| 14 | Interaction design | **Partial / broken** | Hover + focus states exist, `prefers-reduced-motion` honoured (`src/index.css:48-56`). Scroll reveals are dead code — see §3.3 |
| 15 | Mobile quality | **Unverified** | Responsive classes are present and thoughtful; no device testing was possible here |
| 16 | SEO implementation | **Partial** | Home page is well marked up. Canonical/OG/sitemap/robots all point to `https://theoffice.studio/`, not the deployed `the-office-test4.vercel.app`. No `<meta name="robots">`. No runtime `document.title`/description, so `/notes`, `/privacy`, `/terms` all serve the homepage's title and description |
| 17 | Accessibility | **Partial** | Semantic headings, `aria-invalid`/`aria-describedby`, `role="alert"`, live regions, reduced motion. Gaps: no skip-to-content link anywhere (`grep -i skip` → 0 hits); global `:focus-visible { outline: 2px solid #000 }` (`src/index.css:42-45`) is invisible on the black contact section |
| 18 | Performance engineering | **Partial** | See §3.4 |
| 19 | Error and edge states | **Partial** | 404 component exists (`src/App.tsx:750-834`) and is in-voice, plus ErrorBoundary, toasts, form error/success. But `vercel.json` rewrites only `/privacy`, `/terms`, `/notes` — there is no catch-all rewrite and no `public/404.html`, so a hard load of an unknown URL will not reach the styled 404 in production (inferred from config, not tested against a live deploy) |
| — | Final quality review | **Not done** | No test suite, no ESLint config despite `eslint-disable` comments in source, `npm run lint` is just `tsc --noEmit` |

---

## 3. Specific problems found

### 3.1 The colour system is declared but never used
`src/index.css:8-19` defines `--color-paper-tint: #f4f3ef` (the warm neutral the brief asks
for), `--color-mute: #6b6b6b`, `--color-faint: #d4d4d4`, `--color-rule`. Grep counts across
`src/`: `paper-tint` 1 hit, `color-mute` 1, `color-faint` 1, `color-rule` 1 — i.e. the
declaration itself and nothing else. The site renders pure `#000` on pure `#fff`. Phase 13's
"warm neutral backgrounds / deep charcoal typography / restrained accent" is therefore not
implemented; the tokens are dead.

### 3.2 Fabricated credibility (the brief forbids this twice)
The email says: *"Never fabricate clients, results, revenue, awards, testimonials,
partnerships"* and *"Do not invent identities."* Current state:

- `src/App.tsx:163-190` — four named "principals" (Samantha Dion, Marcus Kowalski, Lena Park,
  James Reid) with initials avatars, titles and specific career claims ("Former commissioning
  editor at a mid-size trade house", "twelve years", "Former literary agency researcher").
  Presented as real people, no disclaimer.
- `src/App.tsx:145-162` — three testimonials with quoted speech and attributed roles. Labelled
  "Illustrative · composite from past engagements" (`src/App.tsx:1259`), which mitigates but
  does not remove the invented quotes.
- `src/App.tsx:69-125` — six projects with outcomes ("Acquired quickly; led the publisher's
  spring list", "Hit a national advice list week one"). Labelled "Illustrative · Names &
  specifics generalised" (`src/App.tsx:1060`).
- `src/components/ManifestBar.tsx:29` — a counter animating to `142` labelled
  `ACTIVE 142 —IL`, framed in a code comment as a "rolling indicator".

These are the highest-risk items in the repo: a studio that sends this to a real client is
making claims it cannot support.

### 3.3 Scroll reveals are dead code (Phase 14)
`useReveal()` (`src/App.tsx:727-745`) queries `.reveal` and adds `is-visible`. Two problems:
no element in the codebase carries the `reveal` class (the only hits for "reveal" in `src/`
are the hook itself and the CSS), and the CSS selector is `.reveal.in` (`src/index.css:110`),
not `.reveal.is-visible`. So the hook observes nothing, and even if it did, nothing would
change visually. Either delete it or wire it up correctly.

### 3.4 Bundle and production build
- `vite.config.ts:78-80` sets `manualChunks: { vendor: ["react", "react-dom"] }`, but the
  emitted `vendor-*.js` is 11.26 kB — that is `react` alone. `react-dom` (and scheduler)
  landed in the 274 kB `index-*.js` chunk (`createRoot` and `scheduleCallback` both appear in
  it). The split is not doing what it intends.
- `vite.config.ts:75` sets `sourcemap: true` for the production build; `dist/assets/` ships a
  1.14 MB `.map` alongside the bundle. Public sourcemaps on a studio site are both a weight
  and an exposure problem.
- `Marketing_Impact_Report_Roy_Amazon_SEO_2026.pdf` (4,957,723 bytes) sits at the repo root
  and is byte-identical to `public/downloads/amazon-seo-sample-report.pdf` (same md5
  `2bd474db…`). ~5 MB of duplicate committed.

### 3.5 Small bugs and inconsistencies
- `src/components/Typewriter.tsx:47` — the cleanup returns `clearTimeout(start)` but the
  inner `setInterval` (`t`) is never cleared on unmount; the interval keeps firing after the
  component is gone.
- The hero's primary CTA is hidden until the typewriter reports done (`src/App.tsx:977`:
  `opacity-0 pointer-events-none` while `!heroDone`). The reduced-motion path calls `onDone`
  immediately, so it degrades safely — but the main CTA is gated on an animation completing.
- The cookie notice (`src/App.tsx:1395-1428`) states "We use minimal analytics to understand
  traffic patterns." `track()` (`src/App.tsx:201-218`) only pushes to `window.track` /
  `dataLayer` if something else defines them, and no analytics script is loaded anywhere.
  The notice promises a thing that does not exist. `checkHealth()` in `src/lib/api.ts:148` is
  likewise exported and never called.
- The Web3Forms access key `9c3fe5d9-088e-4c8c-80b9-5a2d3702d395` is hardcoded in
  `src/lib/api.ts:9` **and** `api/brief.ts:8-11` **and** committed in `.env.example:7`.
  A browser-side key is unavoidable for Web3Forms, but committing it as an "example" env value
  and duplicating it in three places is not defensible.
- `README.md` is stale: the "Production Checklist" says *"Replace `/privacy` and `/terms` stub
  routes with real pages"* — those are real 117/119-line pages now. It also documents Resend
  as the email path while Web3Forms is the primary one, and lists `CORS_ORIGIN` in
  `api/brief.ts` which does not exist (`setCors` echoes the request origin instead).
- `api/brief.ts` reflects any `Origin` back in `Access-Control-Allow-Origin` — the README
  claims CORS is "restricted to production domain". It is not.
- `api/health.ts` reports `503 degraded` unless `RESEND_API_KEY` and `TO_EMAIL` are set, but
  the live delivery path is Web3Forms, so health will read degraded on a site that can in fact
  email fine.

---

## 4. What hasn't been done — prioritised

**P0 — correctness and honesty**
1. Remove or clearly mark the four invented team identities (`src/App.tsx:163-190`).
2. Decide on testimonials: get real ones, or drop the quotes and keep the principles framing.
3. Decide on the six projects: keep them labelled as illustrative patterns, or replace with the
   one real deliverable (the Amazon SEO report) plus an explicit "case studies on request" frame.
4. Fix or remove the `142` active-engagements counter.
5. Fix the dead scroll-reveal code (`is-visible` vs `.in`, and no element uses `.reveal`).

**P1 — the phases that are simply missing**
6. Phase 5: build the 01–06 process/methodology section. Nothing exists today.
7. Phase 7: build a real "Why THE OFFICE" positioning section.
8. Phase 11: add the missing contact fields — timeline, scope, budget, discovery source, and
   multi-select services. Backend already accepts them; only the UI is missing.
9. Phase 12: add a mobile menu, and add Approach + Notes to the desktop nav.
10. Phase 6: case-study pages (or a documented decision not to build them).

**P2 — quality**
11. Phase 13: apply the warm-neutral/charcoal palette the tokens already define.
12. Phase 16: point canonical/OG/sitemap/robots at the real domain; add per-route titles and
    descriptions; add `/notes/:slug` URLs and list them in the sitemap.
13. Phase 17: add a skip link; give the black contact section a visible focus ring.
14. Phase 18: fix the vendor chunk split, turn off production sourcemaps, delete the duplicate
    root-level PDF.
15. Phase 19: add a catch-all rewrite (or `public/404.html`) so the styled 404 is reachable.
16. Housekeeping: move the Web3Forms key out of source and `.env.example`, update the README,
    make `/api/health` reflect the actual delivery path, and add a linter + at least a smoke
    test so "no console errors" is a claim someone can check.

---

## 5. Resolution log — everything in §4 has been actioned

Sections 1–4 above are the audit as it stood. This section records what was
built in response, and how each item is verified.

### P0 — correctness and honesty

| # | Gap | Resolution |
|---|-----|------------|
| 1 | Four invented team identities | `src/data/team.ts` — seats are role-first. `name`, `portrait`, `link` only render when `verified: true`; every seat ships `verified: false`. The smoke test asserts none of the four invented names appear in the rendered HTML |
| 2 | Invented testimonials | Deleted. `src/data/why.ts` exports `commitments` — six things the studio commits to — rendered in section 04 with an explicit note that testimonials were removed and references are given on request |
| 3 | Six projects claiming outcomes | `src/data/projects.ts` — rewritten as engagement patterns. `client`/`result` render only under `verified: true`. Outcome claims removed from every entry; the smoke test asserts two of the old claims are gone |
| 4 | `142` active-engagements counter | Removed from `src/components/ManifestBar.tsx`. The bar now shows only verifiable data: live UTC clock and the current quarter, computed from the clock |
| 5 | Dead scroll-reveal code | `src/hooks/useReveal.ts` adds `is-visible`, `src/index.css` now targets `.js .reveal.is-visible`, and six section wrappers carry `reveal`. Hidden state is scoped behind `.js` (added in `main.tsx`) so no-JS visitors see content; reduced motion short-circuits to visible |

### P1 — phases that were missing

| # | Gap | Resolution |
|---|-----|------------|
| 6 | Phase 5 process section | `src/data/process.ts` + section `03 / APPROACH` — six stages with artefact and rough weight, plus the caveat that the sequence flexes |
| 7 | Phase 7 why section | `src/data/why.ts` + section `04 / WHY THE OFFICE` — eight themes, each a claim about how the studio works |
| 8 | Phase 11 contact fields | `src/components/BriefForm.tsx` — services (multi-select, required), timeline, scope, budget and discovery added. Backend schema gained `scope` (`api/_lib/validate.ts`); `service` widened to 200 chars for the comma-joined list |
| 9 | Phase 12 nav + mobile menu | `src/components/SiteHeader.tsx` — shared header on every route, 7 items (Services, Work, Approach, Why, About, Notes, Contact) from `NAV_ITEMS`, plus a real mobile menu with `aria-expanded`, focus-into-panel, Escape-to-close, click-away and body scroll lock |
| 10 | Phase 6 case studies | `src/pages/CaseStudyPage.tsx` at `/work/:slug` — project cards are now links; each page has problem / approach / deliverables, adjacent work, and a CTA |

### P2 — quality

| # | Gap | Resolution |
|---|-----|------------|
| 11 | Phase 13 palette | `--color-paper-tint` now surfaces five places (Approach section, notes index callout, case-study deliverables and "more notes", note "more notes"), `--color-charcoal` carries body type while rules stay pure black, `--color-signal` is used only for the live status dot. `--color-mute` / `--color-faint` remain available |
| 12 | Phase 16 SEO | Canonical/OG/Twitter/JSON-LD repointed at the deployed origin; `src/hooks/useDocumentMeta.ts` rewrites title, description, canonical, OG and `robots` per route; `/notes/:slug` and `/work/:slug` exist and are in the sitemap; `scripts/build-sitemap.mjs` regenerates `sitemap.xml` from `src/data/*.ts` (13 URLs) |
| 13 | Phase 17 a11y | `SkipLink` on every route; `.on-ink :focus-visible` gives black sections a white ring; `<main id="main">` landmark on every page |
| 14 | Phase 18 performance | `manualChunks` is now a function over `node_modules` — entry chunk 274.33 kB → **105.75 kB** (28.61 kB gzip), vendor 218.23 kB cacheable across deploys. `sourcemap: false` in production (was shipping a 1.14 MB `.map`). Duplicate root PDF deleted (identical md5 to `public/downloads/amazon-seo-sample-report.pdf`) |
| 15 | Phase 19 404 reachability | `vercel.json` gained `/notes/:slug`, `/work/:slug` and a catch-all `((?!api/).*)` rewrite, so a hard load of any unknown path reaches the styled 404 |
| 16 | Housekeeping | Web3Forms key centralised in `src/lib/site.ts` (was in three files) and removed from `.env.example`; `api/brief.ts` now has a real CORS allowlist (403 + no ACAO for unknown origins) and returns **503** instead of a fake 200 when no provider is configured; `/api/health` checks the actual delivery path; `Typewriter` clears its interval on unmount; the cookie notice no longer claims analytics that do not exist; README rewritten |

### Verification added

| Command | Covers | Result this pass |
|---------|--------|------------------|
| `npm run lint` | `tsc --noEmit` over `src`, `api`, `vite.config.ts` | exit 0, no diagnostics |
| `npm run build` | Production bundle | 59 modules; `index` 105.75 kB / 28.61 kB gzip, `vendor` 218.23 kB / 68.49 kB gzip, CSS 30.23 kB; no `.map` emitted |
| `npm run smoke:ssr` | Renders all 8 routes through the real `App` tree and asserts section content, form fields and the absence of fabricated strings | 8/8 routes, 37 assertions |
| `npm run smoke:api` | Drives `api/brief.ts` + `api/health.ts` with mock req/res | 13/13 checks (CORS 403, honeypot, Zod 400 with field paths, 429 on the 6th request, 503 with no provider) |
| `npm run sitemap` | Regenerates the sitemap from content files | 13 URLs |
| dev server `curl` | `/`, `/notes`, `/notes/:slug`, `/work/:slug`, `/privacy`, `/terms`, unknown path, PDF, sitemap, robots, `/api/health`, `POST /api/brief` | all 200 / expected JSON |

The smoke test earned its place immediately: it caught that the SSR entry was
missing `ToastProvider`, and that `REQUESTED: {path}` rendered as fragmented
text nodes so the 404 path was not a contiguous string.

### Still open (needs a human, not code)

- **Verified content.** Team names, portraits, real client case studies and
  references can only be added by the studio. The components are ready; the
  flags are `verified: false`.
- **Custom domain.** `theoffice.studio` is still only an intention. Everything
  points at `the-office-test4.vercel.app` until it is, then: set
  `VITE_SITE_URL`, re-run `npm run sitemap` with `SITE_URL=`, update
  `index.html`, `robots.txt` and `CORS_ORIGIN`.
- **Live delivery.** Web3Forms delivery into the Gmail inbox was not exercised
  from a browser in this pass — only the local dev middleware and the handler
  logic were.
- **Lighthouse / real device pass.** No headless browser is available in this
  sandbox, so Core Web Vitals, contrast ratios and breakpoint rendering are
  still unverified by measurement.
- **ESLint.** Still absent. `npm run lint` is typecheck only, so the
  `eslint-disable` comments in source are inert.

---

## 6. Finalisation pass

Added the two things §5 listed as open and could actually be closed here: a
linter and a runtime test suite that drives the real client bundle.

### Linter

`eslint.config.js` — ESLint 9 flat config with `typescript-eslint`,
`eslint-plugin-react-hooks` and `eslint-plugin-jsx-a11y` (enabled deliberately,
since Phase 17 is an accessibility phase). `npm run eslint` passes clean. It
found four real findings on first run, all fixed:

| Finding | Fix |
|---------|-----|
| `react-hooks/set-state-in-effect` in `Typewriter` | Reduced-motion line is now computed in the `useState` initializer instead of set from an effect, so the full line is present on first paint |
| Stale `eslint-disable no-console` in `ErrorBoundary` | Removed — `console.error` is allowed by config |
| `window is not defined` in the SSR smoke script | Qualified as `globalThis.window` |
| `no-console` in `vite.config.ts` | Informational logging allowed for Node tooling only |

### Runtime suite

`scripts/smoke-dom.mjs` bundles the real `src/main.tsx` with esbuild and mounts
it in jsdom for every route. It covers what the SSR suite cannot: effects,
event handlers, `matchMedia`, `localStorage`, controlled-input updates and the
network payload. **111 checks pass across the three suites.**

### Bugs this suite caught

1. **An empty env var silently disabled the form.** `site.ts` read
   `import.meta.env.VITE_WEB3FORMS_KEY ?? fallback`. `.env.example` ships that
   line as `VITE_WEB3FORMS_KEY=` — an empty string, which is not nullish, so the
   fallback never applied and the brief posted to Web3Forms with no access key.
   Anyone following the README's `cp .env.example .env.local` would have shipped
   a broken contact form. `orFallback()` now treats blank as absent, and the DOM
   suite asserts the key survives even with the var defined as `""`.
2. **Reduced-motion visitors waited for an effect to see the primary CTA.**
   Measured at ~300 ms in jsdom. `heroDone` now initialises from
   `prefersReducedMotion()` (`src/utils/motion.ts`), so the CTA is in the first
   paint for anyone who has asked for less motion.
3. **`import.meta.env[name]` does not survive bundling.** The first fix used a
   dynamic lookup; esbuild warned it could not replace it and the bundle threw
   at runtime. Reverted to literal `import.meta.env.VITE_*` member accesses,
   which both Vite and esbuild replace statically.

### Verification, final state

| Command | Result |
|---------|--------|
| `npm run lint` | exit 0, no diagnostics |
| `npm run eslint` | exit 0, 0 problems |
| `npm run build` | index 105.92 kB / 28.68 kB gzip · vendor 218.23 kB / 68.49 kB gzip · CSS 30.48 kB · no `.map` |
| `npm run smoke` | all green — 131 reported checks: 8 SSR route summaries covering 37 assertions, 13 API, 110 DOM |
| `npm run sitemap` | 13 URLs |

### What still cannot be closed here

- **Browser-level checks.** Horizontal overflow, computed contrast, real focus
  rings and Core Web Vitals need a rendering engine. None can be installed:
  `storage.googleapis.com` and `deb.debian.org` both return 000 from this
  sandbox, there is no system browser, and the npm-distributed Chromium
  (`@sparticuz/chromium`) exits 127 for want of `libnss3.so`, `libnspr4.so` and
  `libnssutil3.so`, which no reachable package provides. jsdom has no layout
  engine, so it cannot substitute.
- **Live email delivery.** A real Web3Forms submission would put a message in
  `theofficetechies@gmail.com`. Not sent without being asked — say the word and
  it is one request.
- **Verified content, custom domain.** Unchanged from §5: both need the studio.

---

## 7. Bug report: mobile menu would not close

**Reported:** the menu icon does not close after opening.

**Reproduced first**, before touching the component. The DOM suite only covered
Escape; clicking the toggle a second time was never tested. Adding that case
failed exactly as reported — `aria-expanded` stayed `"true"`.

**Cause.** `SiteHeader` attached a document-level `mousedown` click-away handler
that closed the menu for any target outside the panel. The toggle button lives
outside the panel, so clicking it ran two handlers in sequence:

1. `mousedown` → click-away sees the button as "outside" → `setOpen(false)`
2. `click` → the button's own `onClick` toggles `false` back to `true`

The menu reopened on the same gesture. Escape worked, which is why the earlier
suite passed.

**Fix.** The click-away handler now ignores targets inside the toggle, letting
the button own its state. `src/components/SiteHeader.tsx`.

**Two related defects found while in there:**

- *Scroll lock could stick.* The panel and the toggle are both `lg:hidden`, so
  resizing past the desktop breakpoint with the menu open would leave
  `document.body.style.overflow = "hidden"` with nothing on screen to release
  it. Viewport width is now tracked by `useIsDesktop()` and the panel is
  rendered only when `open && !isDesktop`, so the lock is released by the
  effect cleanup.
- *`react-hooks/set-state-in-effect`.* The first attempt at that fix called
  `setOpen(false)` synchronously in an effect body and ESLint rejected it.
  `useIsDesktop()` reads `matchMedia` during the initial state computation
  instead, and the subscription only reports later changes.

**Regression coverage** — ten assertions now cover the menu: opens, closes via
the toggle (with the panel unmounting and the label reverting to `MENU`),
reopens, closes via Escape, closes on an outside click, closes once when a menu
item is chosen, and closes on growing to desktop width with the scroll lock
released.

`npm run smoke` is now 121 reported checks (8 SSR route summaries over 37
assertions · 13 API · 100 DOM), all green; `npm run lint` and `npm run eslint`
both exit 0.

---

## 8. Bug report: the typing animation

**Reported:** the typing animation that was there before.

**Measured before changing anything.** Sampling the hero line in jsdom with
motion allowed:

```
t≈   0ms  chars=  0  caret=1  cta=INVISIBLE  clickable=true
t≈ 400ms  chars=  0  caret=1  cta=INVISIBLE  clickable=true
t≈ 800ms  chars=  5  caret=1  cta=INVISIBLE  clickable=true
t≈1500ms  chars= 30  caret=1  cta=INVISIBLE  clickable=true
t≈2600ms  chars= 66  caret=0  cta=visible    clickable=true
```

The animation itself is intact — the line types out over ~2.5 s and the caret
drops when it finishes. The measurement exposed three regressions I had
introduced *around* it, all confirmed by diffing against `7bfe8cd`:

| # | Regression | Cause |
|---|------------|-------|
| 1 | **The primary CTA was invisible but clickable for the whole ~2.5 s.** `cta=INVISIBLE clickable=true` at t = 0, 400, 800 and 1500 ms | I removed `pointer-events-none` to make the CTA focusable, but kept `opacity-0`. An unclickable-and-invisible button became a clickable-and-invisible one, which is worse |
| 2 | **Hover feedback on the hero CTA stopped animating** | `transition-colors duration-200` had been swapped for `transition-opacity duration-500`, so `hover:bg-black hover:text-white` snapped instead of transitioning — a Phase 14 regression |
| 3 | **The caret changed colour** | `background: #000` → `currentColor`, which resolves to the new charcoal `#141414` on the white hero. The caret only ever renders there, so the change had no upside |

**Fix.** The root problem was gating the primary CTA on a decorative animation
at all. It is now visible from the first paint with `transition-colors
duration-200` restored, `Typewriter` is purely presentational, and the caret is
pure black again. `Typewriter` also lost its now-unused `onDone` / `notify` /
`doneRef` machinery and gained correct effect dependencies
(`[text, speed, startDelay]`) in place of a lint suppression.

Screen readers were never affected: the wrapper carries `aria-label={text}`, so
the full line is announced immediately regardless of how far the animation has
got. That is now asserted rather than assumed.

**Regression coverage** — 12 new assertions: line starts empty with a caret;
full line exposed to assistive tech immediately; CTA visible at first paint;
CTA never carries `pointer-events-none`; CTA keeps `transition-colors` +
`hover:bg-black`; line is partway through at ~1.2 s; line completes at 66 chars
with no caret; CTA still visible afterwards; and under reduced motion the full
line is present on the first paint with no caret. The shipped CSS is checked for
`.caret:after{...background:#000}`.

`npm run smoke` is now 131 reported checks (8 SSR route summaries over 37
assertions · 13 API · 110 DOM), all green; `npm run lint` and `npm run eslint`
both exit 0; build is index 106.17 kB / 28.71 kB gzip, vendor 218.23 kB,
CSS 30.72 kB.

---

## 9. Team identities — three of four supplied

On 27 Aug 2026 the studio supplied three principals' names and roles. They are
recorded in `src/data/team.ts` exactly as provided, with `verified: true`:

| Role | Name (as supplied) |
|------|--------------------|
| Book Strategist & Editorial Lead | Brain J. Fiore |
| Web Design & Front-End | Henri Will |
| Automation & Systems | Collen Johnstone |

The Research & Analysis seat remains role-first until the fourth name arrives.

**Portraits not yet integrated.** The attached photo sheet did not persist into
the workspace (the file was visible in the message but its bytes are not on
disk), so the three portraits could not be cropped and are not wired. Each seat
carries a commented `portrait: "/team/<slug>.jpg"` placeholder; dropping the
images into `public/team/` and uncommenting is the entire remaining step. The
`TeamMember` component already renders a portrait when present and falls back
to the initials mark when not, so the page is not broken in the meantime.

**Spelling confirmation requested** for "Brain" (vs "Brian") and "Collen" (vs
"Colleen"); recorded verbatim pending that.

**Portraits integrated (later on 27 Aug).** The studio committed the photo sheet
to the branch (`ChatGPT Image Aug 27, 2026, 06_36_43 PM.png`, 1254×1254). The
three circles were cropped with ImageMagick to `public/team/{brain-j-fiore,
henri-will,collen-johnstone}.jpg` (600×600) and wired via the `portrait:` fields
in `src/data/team.ts`. Each crop was visually verified as centered and complete;
the component clips them to circles. The SSR/DOM suites now assert the three
portrait paths and their alt text. The source sheet remains at the repo root as
provenance (it is not served — it is outside `public/`); it can be deleted once
the crops are confirmed.

---

## 10. Part 2 build (strategic improvement plan)

Implemented the website plan from `erik-stenman-strategic-response.md` Part 2,
keeping the existing brand (a rebrand to "The Office 360" is a separate,
unmade decision) and the honesty policy.

- **Services** rebuilt as the five from the plan (`src/data/services.ts`):
  Strategic Book Positioning, Discoverability Optimization, Author Authority
  Development, Launch Strategy, Analytics & Reporting — each with the fixed
  internal structure (what / analyze / actions / receive / measured) and a
  fixed-scope pricing line. Service pages and the home rows render this.
- **Methodology** canonicalized to the six stages (Discovery → Analysis →
  Strategy → Implementation → Measurement → Optimization) with what-happens and
  what-you-receive per stage, payment-gates copy, and a dedicated `/methodology`
  page; the homepage strip links to it and uses the same names.
- **Case studies** reformatted to the five-part structure (Problem / Strategy /
  Execution / Measurement / Learning) plus a stated attribution policy and a
  references line. Unverified patterns state method, not invented numbers; the
  one real result (the downloadable backlist report) is published in full.
- **Homepage** gained the positioning statement, an audience row, a
  problem-from-his-side row, a trust block, and a single primary
  "Request an analysis" CTA.
- **Trust section** gained published communication standards and slots for
  LinkedIn profiles and a business address (rendered only when supplied).
- Contact already described the post-click path ("what happens next"), which
  Part 2's cross-cutting #5 requires.

Still needs real data (not invented): testimonials, LinkedIn URLs, business
address, aggregate experience figures, and real case-study numbers beyond the
one published report.

---

## 11. Demos + the Part 2 items that were initially missed

Added after review flagged that not all of Part 2 was implemented:

- **`/demos` page** — "demos and sample work": an interactive 60-second
  discoverability self-audit (the checklist as a scored tool that maps each gap
  to the service that addresses it), a clearly-labelled sample positioning
  document, a clearly-labelled sample report layout, and the one real
  downloadable report. The self-audit is asserted client-side in the DOM suite
  (renders 10 checks, score updates, gaps map to the right services).
- **Homepage service index** — the compact five-item linked index (one line
  each, linking to the full service page) that Part 2 §1 required; it was
  previously only the full rows.
- **Nav / footer / sitemap** — Demos added to navigation and the sitemap (22
  URLs).
- The checklist was extracted to `src/data/checklist.ts` and is now shared by
  the printable page and the demo.

Deliberately still absent (would require real data or would conflict with the
no-fabrication policy): homepage testimonial excerpts, aggregate experience
figures, LinkedIn profiles, and a business address. These remain empty slots.

---

## 12. Rebrand to The Office 360 + de-labelled demos

Owner direction (this turn): the brand is now **The Office 360**, and the demos
should be presented as real, inspectable work — not flagged as "demo/sample".

- **Rebrand.** Every visible brand string now reads "THE OFFICE 360" /
  "The Office 360": header logo, footer, margin rail, page titles/meta, JSON-LD,
  i18n positioning line, and editorial copy. URLs/canonical stay at the deployed
  origin until `the-office360.com` is actually live and hosting this build.
- **De-labelled demos.** `/demos` no longer says "Interactive demo",
  "Sample — not a real client", "Sample report layout" or "Illustrative".
  The self-audit is presented as a working tool ("Start here"), the positioning
  excerpt as "How we position a book", and the report table as "Reporting —
  from our backlist reporting" with the full PDF linked. No client is named and
  no result is invented; the report figures are the real published report's.
- Nav item renamed Demos → **Proof** (PT: Prova).

Verification: tsc + eslint exit 0; smoke:ssr 13, smoke:api 13, smoke:dom 118.
