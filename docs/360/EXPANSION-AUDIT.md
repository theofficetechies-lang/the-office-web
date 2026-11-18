# THE OFFICE 360 — Expansion Audit & Phased Implementation Plan

**Prepared:** 2026-11-18
**Target site:** https://the-office360.com/
**Method:** live-site fetch (all routes, `robots.txt`, `sitemap.xml`), source extraction, and executed
checks (`tsc`, `vite build`, `eslint`, the project's own smoke suite) on the codebase the site is built
from.

---

## 0. Read this first — a corpus problem, resolved

The expansion brief is scoped to `the-office360.com`. **The codebase in this session's working tree is
not that site.** Establishing this was the first job, because every later decision depends on it.

| | This session's branch | The live site |
|---|---|---|
| Branch | `arena/a7e1d1d1-the-office-web` | built from `arena/01a03b70-the-office-web` @ `84b1ba3` |
| Base | `7bfe8cd` | unrelated root-ish commit (no common ancestor) |
| Brand | "THE OFFICE" | **"THE OFFICE 360"** |
| Routes | `/`, `/privacy`, `/terms`, `/notes` only | **16 route kinds**, incl. `/services/:slug`, `/work/:slug`, `/methodology`, `/demos`, `/store`, `/admin` |
| Services | 4, no detail pages | **5, each with a detail page** |
| Locales | en only | **en + pt** (`src/lib/i18n.tsx`, 285 lines) |
| Lead pipeline | Web3Forms, silent-failure bug | Web3Forms (browser) + Resend (server) + correct error codes |
| Payments | none | Paystack (`api/paystack.ts`) |
| Tests | none | smoke suite: SSR + API + DOM (971 lines) |
| Size | 2,999 lines | **~9,500 lines**, 66 TS/TSX/MJS/CSS files |
| `tsc` / `build` / `eslint` | pass / pass / n/a | **pass / pass / pass** |

**Consequences:**

1. Every critical bug I found in the previous turn (silent brief loss, the unreachable `400`/`429`
   handlers, duplicate delivery, the no-op vendor split, published sourcemaps, the dead `useReveal`)
   has **already been fixed upstream**. `api/brief.ts` now returns `502`/`503` instead of pretending
   success; `vite.config.ts` splits on `node_modules` and sets `sourcemap: false`. Do not re-report them.
2. Implementing "expansion" in this working tree would expand a **superseded** site. That is wasted
   work and would fork the brand a third time.
3. Everything in this document is therefore written against **`84b1ba3` — the code that actually serves
   `the-office360.com`** — and should be applied there.

I have not written any application code this turn. The expansion is ~170 new pages, a lead database,
CRM, booking, portal and admin; starting that from a divergent base, before the base is agreed, would
be the single most expensive mistake available.

---

## 1. Existing-site audit (verified against `84b1ba3` + live)

### 1.1 What exists and works

**Stack.** React 19.2.6 · Vite 7.3.2 · Tailwind 4.1.17 · TypeScript 5.9.3 strict · Zod 3.25.7 ·
Resend · Vercel serverless · ESLint 9 with `jsx-a11y` and `react-hooks`. No router library — a 74-line
`src/lib/router.ts` with 16 route kinds, all depth-1 rewrites in `vercel.json` plus a catch-all.
**Content is data-driven** from `src/data/` (12 modules), which is exactly the right foundation for a
catalogue expansion and should be preserved.

**Routing (16 kinds).** `home`, `privacy`, `terms`, `notesIndex`, `note`, `work`, `service`, `press`,
`glossary`, `checklist`, `methodology`, `demos`, `store`, `storeProduct`, `admin`, `notfound`.
`matchRoute` normalises trailing slashes and validates slugs against `^[a-z0-9]+(-[a-z0-9]+)*$`.

**What genuinely improved since the base commit:**

| Area | Evidence |
|---|---|
| Per-route metadata | `src/hooks/useDocumentMeta.ts` — title, description, canonical, OG/Twitter, `robots` per route |
| Semantics | skip link (`src/components/SkipLink.tsx`), `#main` landmark on every page |
| i18n | `src/lib/i18n.tsx`, en + pt, `<html lang>` switching |
| Lead delivery | `api/brief.ts` returns **502/503 on failure**; CORS is an **allowlist** with `*.vercel.app` + localhost dev only |
| Brief fields | name, email, org, services[] (multi-select), brief, timeline, scope, budget, discovery, honeypot |
| Tests | `smoke:ssr`, `smoke:api`, `smoke:dom` + a DOM harness on jsdom |
| Payments | `api/paystack.ts` + `src/lib/paystack.ts`, hosted-redirect flow |
| Content surfaces | 5 services, 5 case patterns, 3 notes, 8 glossary terms, 10-point self-audit, 5 products, 5 FAQ, 3 pricing shapes, 6-stage method |
| Accessibility | `.reveal` correctly scoped behind `.js`, `is-visible` state, inverse-section focus ring, reduced-motion |
| Honesty posture | explicit "no fabricated testimonials"; sample PDF published in full |

That is a strong, disciplined foundation. **UI preservation is therefore not a constraint to
negotiate — it is the correct strategy.** The existing system (margin rail, folio/`SEC.` device,
Fraunces/Inter Tight/JetBrains Mono, hairline rules, `ink-block`, 12-col grid, `MarginRail` +
`MobileFolioStrip` pattern) is the asset the expansion must reuse.

### 1.2 Defect register (verified, ranked)

| # | Severity | Finding | Evidence |
|---|---|---|---|
| **D1** | **Critical** | **Every canonical URL on the live domain points at the Vercel preview host.** `robots.txt` on `the-office360.com` serves `Sitemap: https://the-office-test4.vercel.app/sitemap.xml`; the live `sitemap.xml` contains **29 URLs, all on `the-office-test4.vercel.app`**; `index.html` ships 19 `test4` references including canonical, all 3 `hreflang` alternates, RSS, `og:url`, `og:image` and both JSON-LD `@id`s. Confirmed live: fetching the homepage returns `image: https://the-office-test4.vercel.app/og-image.png`. **101 occurrences of `test4` in the shipped surface.** Until `VITE_SITE_URL` is set and `index.html`/`robots.txt` regenerated, Google is told the real domain is a duplicate of a preview deployment. | `public/robots.txt:4`, `public/sitemap.xml`, `index.html:11,14-17,29-30,40,50-78`, `src/lib/site.ts:29`, `scripts/build-sitemap.mjs:16` |
| **D2** | **Critical** | **Prices are charged in the wrong currency unit.** `amount: Math.round(product.priceUsd * 100)` sends *dollars×100* to Paystack, which interprets `amount` as **minor units of NGN (kobo)**. A `$950` product charges **₦950** (≈ $0.63 at ~1,500 NGN/USD). A `$49` product charges ₦49. No FX conversion exists anywhere in the repo. | `api/paystack.ts:68` |
| **D3** | High | **Admin is publicly reachable with a default passcode.** `/admin` is linked from the site footer and gated only by `VITE_ADMIN_PASSCODE ?? "admin123"` compared in the browser; the flag is `localStorage["the-office360:admin"] === "1"`. Catalog edits then persist to `localStorage`. There is no server-side authorisation. | `src/pages/AdminPage.tsx:9-11,27,42`, `src/components/SiteFooter.tsx:104` |
| **D4** | High | **No lead persistence.** No KV/Postgres/Sheets/CRM anywhere (`grep` for `kv|redis|postgres|supabase|database|insert|airtable|hubspot|notion` → 0). A brief exists only as an email. There is nothing to build a pipeline, an admin lead list, reporting or follow-up automation on. | `api/brief.ts`, `src/lib/api.ts` |
| **D5** | High | **The smoke suite fails 7 checks and is not gated.** `npm run smoke` exits 1. Of the 7, **one is a real user-visible bug** (below) and six are stale assertions pinning superseded copy. | `scripts/smoke-dom.mjs`, reproduced this session |
| **D6** | High | **The hero CTA renders with `class="undefined"`.** The smoke selector is `a[href="#contact"]` whose text includes `SEND A BRIEF`, and the live hero now says **"REQUEST AN ANALYSIS →"**. The matched element therefore has no className: `check("hero CTA keeps its hover colour transition", cta?.className.includes(...))` reports `class="undefined"`. Either an element is rendering without classes or the CTA lost its styling contract. Must be resolved before any hero work. | `scripts/smoke-dom.mjs:486-515`, live hero |
| ~~**D7a**~~ | ~~High~~ | **Closed — the admin passcode.** `/admin` shipped with `admin123` as both the bundle default and a printed on-screen hint. Edits are localStorage-only, so the blast radius was each visitor's own browser, but a decorative gate presented itself as access control. The panel now ships no credential, states that it is a preview tool rather than a login, and a build guard fails if the literal returns to any bundle. | `src/pages/AdminPage.tsx` |
| **D7b** | High | **Still open — customer "auth" is email alone.** `src/lib/auth.tsx` signs a customer in with an email address only — no password, no token, no verification — and writes them to `localStorage` as if authenticated. Entitlement/payment state hangs off that cosmetic session. This needs the Phase 8 auth decision, not a patch. | `src/lib/auth.tsx` |
| **D8** | Medium | **Checkout cannot be fulfilled.** No webhook (`grep` for `webhook` → none), no order record, no download entitlement, no receipt. `verifyReference` returns a status string and is not wired to fulfilment. Products are "instant download" with nothing that grants a download. | `api/paystack.ts`, `src/lib/paystack.ts`, `src/pages/StorePage.tsx` |
| **D9** | Medium | **Zod `.min()` still runs before `.transform(trim)`.** Whitespace-only name/brief passes validation and is emailed as empty. Same defect I reproduced on the old branch; unchanged here. | `api/_lib/validate.ts:6-8,54-56` |
| **D10** | Medium | **`useDocumentMeta` only updates on the client.** Hard-load crawlers that do not execute JS see the homepage's title/description on every one of the 29 URLs. No prerender/SSR (`src/entry-ssr.tsx` exists but `vercel.json` deploys a pure SPA build). | `src/hooks/useDocumentMeta.ts`, `vercel.json` |
| **D11** | Medium | **Locales are not in the URL.** `hreflang` alternates are declared for `en`/`pt`, but both resolve to the same URL and the language is a `localStorage` toggle — so the `hreflang` trio is invalid and pt content is not indexable. | `index.html:14-16`, `src/lib/i18n.tsx` |
| **D12** | Medium | **No breadcrumbs, no `BreadcrumbList`, no `Organization`-level `sameAs`, no `Service`/`FAQPage` schema on the 5 service pages or the FAQ block** — the structured-data work stops at two `@id`s. | `index.html:48-80` |
| ~~**D13**~~ | ~~Medium~~ | **Closed — my original reading was wrong.** `/rss.xml` ships and a `rel="alternate"` link tag is present in the generated HTML on every page, verified in `dist/index.html` and in all 96 prerendered documents. Not a defect. | `index.html`, `dist/**/index.html` |
| **D14** | Low | Dev middleware logs the **full brief** (name, email, org, message) to stdout; `req.url === "/api/brief"` is exact-match so query strings bypass it. | `vite.config.ts:15,27,35` |
| **D15** | Low | `vercel.json` still ships deprecated `X-XSS-Protection`; no HSTS; no CSP for the app (only on the API response). | `vercel.json:24-27` |
| ~~**D16**~~ | ~~Low~~ | **Closed — `/demos` is in the sitemap** (ranked 0.7 as intended); only `/admin` is absent, which is correct. Verified in `dist/sitemap.xml`. | `dist/sitemap.xml` |

### 1.3 Content and conversion gaps against the brief

- **5 services** against a brief asking for 167 across 6 divisions. No `/services` hub.
- **No `/industries`** anything (brief asks for 20).
- **No `/about`** page — the About content is a homepage section only.
- **No consultation booking** of any kind.
- **No `/insights`** taxonomy — `/notes` is a flat list of 3.
- **No portfolio page** — `/work` is homepage-anchored with 5 slug pages.
- **Services are book-shaped only.** The brief's Divisions A–D and F (web, AI, marketing, branding,
  BI/consulting) are entirely absent from the catalogue, though the site's *method* transfers cleanly.
- **The 6-stage method** (`src/data/process.ts`) is a genuine differentiator and is currently used on
  exactly one page — it should be the spine of every service page.
- **Trust without fabrication** is handled well and is the constraint the expansion must respect: no
  invented industry clients, results, certifications or offices. Industry pages must be framed as
  *challenges and recommended approaches*, not as claims of experience.

---

## 2. The strategic decision the brief forces

### 2.0 The totals, stated once

- **167** entries in `serviceCatalog.ts`: **40 flagship** (own page) + **127 catalogue** (anchored on a division hub).
- **5** published services with dedicated pages that predate the catalogue and are deliberately not duplicated in it.
- **172** total offered (`TOTAL_SERVICES`), which is 167 + 5.
- **45** pages under `/services/<slug>`: 40 flagship + 5 published.
- **96** prerendered routes in total: 45 + 6 division hubs + `/services` + `/industries` + 20 sectors + the editorial pages.

These disagree with each other only if you confuse "catalogue entries" with "everything
the studio offers", which is an easy mistake and has been made in this project's own
summaries. The site derives every number it displays from data for exactly that reason.

### 2.1 167 service pages is the wrong number, by the brief's own rules

The brief asks for 167 services *and* forbids "empty, duplicate or superficial service pages merely to
increase page count", *and* forbids "doorway pages, duplicated pages" (§17, §10). Those constraints are
incompatible at 167 pages: 30 web-development services cannot each carry a unique, non-duplicative
1,000-word treatment without either inventing expertise the studio has not demonstrated or padding.

It also collides with the brand. The live site's differentiator is a **small, senior, analysis-first
studio**. Publishing 167 "we do everything" pages reads as a generic agency — precisely what §4 and the
existing positioning warn against.

**Recommendation: a two-tier catalogue.**

| Tier | Count | Surface | Depth |
|---|---|---|---|
| **Flagship** | **40** | own URL `/services/:slug` | full 14-section template (brief §9) |
| **Catalogue** | **127** | anchored entry on its division hub `/services/:division#slug` | ~180–250 words: what it is, who needs it, problem solved, included, CTA |

40 flagship + 6 division hubs + 20 industry pages + ~40 insight/legal/utility = **~110 URLs**, of which
**~66 carry substantive original content**. That satisfies "comprehensive" without doorways, and it can
be delivered to a standard the studio can defend.

The full machine-readable map is in **`docs/360/service-catalog.json`** — 167 catalogue services, each with a
stable slug, its division, and its tier. **No proposed slug collides with the five live URLs**
(`book-positioning`, `discoverability`, `author-authority`, `launch-strategy`, `analytics-reporting`),
verified programmatically, so existing rankings are not put at risk.

### 2.2 What this means for the brand

The brief repositions the company as "Digital Solutions for Modern Business". The live site is "a
four-person studio for books, web, automation, research". These are reconcilable but not identical, and
the resolution has commercial consequences:

- **Do not** flatten the positioning into generic full-service language. The book/publishing
  specialism is the only defensible wedge, and the repo's own strategic blueprint
  (`the-office360-strategic-blueprint (1).md`) argues the same thing at length: *retain the
  high-trust studio as the cash engine, productise the knowledge, do not become a generic portal.*
- **Do** present the six divisions as **one method applied to six domains** — the existing
  6-stage analysis-first method is already domain-agnostic and is the honest bridge.
- **Do** keep publication/publishing as Division E, not as the whole company.

This is a business decision, not a coding one, and I need your confirmation before writing 40 pages of
copy in either direction (§3, Q1).

---

## 3. Questions that block implementation

I need four answers before building. Everything else I can decide and justify myself.

**Q1 — Base.** The live site is not this working tree. Should I (a) treat `84b1ba3`
(`arena/01a03b70-the-office-web`) as the base for all expansion work, or (b) expand the older
codebase in this working tree anyway? I strongly recommend (a); (b) splits the brand again.

**Q2 — Catalogue depth.** Two-tier 40 flagship / 127 catalogue (my recommendation), or all 167 as
full standalone pages?

**Q3 — Positioning.** Keep book/publishing as the visible wedge with the other five divisions as
adjacent capability, or lead with the neutral "Digital Solutions for Modern Business" framing?

**Q4 — Real functionality scope.** Which of these do you want built for real, given each needs an
external account and credentials before it can honestly be called working? Any I do not build, I will
leave *visibly* unbuilt rather than ship a fake button — per §30.10.
- **Lead storage + admin lead list** (needs Vercel KV or Postgres — free tiers exist)
- **CRM / pipeline** (could be the same store; no third-party needed)
- **Consultation booking** (Cal.com/Calendly embed = free; or build slots into the KV store)
- **Payments fixed** (needs a working `PAYSTACK_SECRET_KEY`; I can fix D2/D8 without one)
- **Client portal** (needs real auth — see D7; I recommend deferring to Phase 8 as the brief itself allows)

---

## 4. Phased implementation plan

Each phase is independently shippable and independently verifiable. Effort is my estimate of focused
work, not elapsed time.

### Phase 0 — Correctness & trust (must precede expansion) · ~1 day
Fixes everything that would otherwise be multiplied across 110 new pages.

- **D1** set `VITE_SITE_URL=https://www.the-office360.com`, regenerate `index.html`/`sitemap.xml`/
  `robots.txt`/`rss.xml`, add a **CI assertion that fails the build if `test4` appears in `dist/`**.
- **D2** fix the Paystack amount (convert USD→NGN minor units at a configurable, editable rate, or
  switch the catalogue to NGN pricing outright) and **add a test that asserts the amount sent**.
- **D3/D7** remove the `/admin` footer link; replace the passcode with server-verified auth or take the
  panel offline until Phase 8.
- **D5/D6** fix the 6 stale smoke assertions, resolve the `class="undefined"` hero CTA, and **gate CI
  on `smoke`** so the suite cannot rot again.
- **D9** `.trim()` before `.min()`. **D14/D15** drop the brief dump and `X-XSS-Protection`, add HSTS.

### Phase 1 — Content architecture · ~2 days
Structure only, no new pages yet. Extends the existing data-driven pattern.

- `src/data/divisions.ts` — 6 divisions (id, n, title, slug, intro, serviceSlugs[])
- `src/data/serviceCatalog.ts` — generated from `docs/360/service-catalog.json`
- `src/data/industries.ts` — 20 industries (challenges, opportunities, recommended services, scenarios)
- `src/data/inquiryTypes.ts` — the 10 inquiry pathways (§10)
- Router: add `servicesIndex`, `division`, `industries`, `industry`, `about`, `booking`, `insights`
- `scripts/build-sitemap.mjs`: read the new data modules so the sitemap stays generated, not typed

### Phase 2 — Services (the bulk) · ~2 weeks
- `ServicePage.tsx` refactored to the 14-section template (§9) with the 6-stage method embedded
- 40 flagship pages, each with distinct copy; enforced by a **"no duplicate paragraph" test**
- 6 division hubs, each with 8–30 anchored catalogue entries
- `/services` overview; nav "Services" gains a hub link; every existing service page gains
  related-service links and breadcrumbs

### Phase 3 — Industries · ~4 days
20 pages framed as *challenges → recommended approach → relevant services → example scenarios*, with
**no claimed clients**. Cross-linked both ways to services.

### Phase 4 — Lead infrastructure · ~5 days (needs Q4 credentials)
Schema, KV store, `/api/inquiries`, 10 inquiry forms reusing `BriefForm`'s styling, validation, spam
protection, consent, acknowledgement email, internal notification, **admin lead list with
search/filter/sort/CSV** — reading real data, not localStorage.

### Phase 5 — Booking · ~3 days
Consultation types, slot availability, timezone handling, confirmation + reminder emails, calendar
integration (ICS at minimum).

### Phase 6 — SEO & analytics · ~4 days
Breadcrumbs + `BreadcrumbList`; `Service`/`FAQPage`/`Organization` schema; `/pt` URL prefix and
`hreflang`; prerender the ~110 routes so crawlers get real HTML (D10); event tracking wired to a real
sink (the live site has `track()`-equivalent plumbing but no analytics configured).

### Phase 7 — CRM & pipeline · ~4 days
12-stage pipeline on the Phase-4 store; notes, follow-up reminders, activity history, proposal status.

### Phase 8 — Portal, proposals, admin · ~1–2 weeks, needs auth decision
Deferred deliberately, as the brief instructs (§13). Requires real authentication first.

---

## 4a. Build status (updated as work lands)

Kept here so the plan and the repository cannot drift apart. Each line below was
verified by a gate, not by inspection.

| Phase | Status | Evidence |
|---|---|---|
| 0 — Correctness & trust | **Done** | D1/D3/D5/D6/D9/D14/D15 fixed; origin guard, money test (24 assertions) and smoke suite gated in `npm run verify` |
| 1 — Content architecture | **Done** | 167-service catalogue, 6 divisions, 20 industries, 10 pathways, 4 route kinds |
| 2 — Services | **Done** | 40/40 flagship pages, 6 division hubs, `/services`; content gate green and promoted into `verify` |
| 3 — Industries | **Done** | `/industries` + 20 sector pages, no claimed clients |
| 4 — Lead infrastructure | **Not started** | Needs the KV/Postgres decision. The form now tags leads by division and pathway so routing has something to route on |
| 5 — Booking | **Rejected** | Not one of the four selected capabilities; will not be faked |
| 6 — SEO & analytics | **Done (D10/D11/D12)** | All 96 routes prerendered with unique head + JSON-LD; 404 noindex; hreflang collapsed to `en`; sitemap 96 URLs. Analytics events still open |
| 7 — CRM & pipeline | **Not started** | Follows Phase 4 storage |
| 8 — Portal/proposals/admin | **Deferred** | As instructed |

**Content gate** (`npm run test:content`) now enforces 40/40 coverage, substance,
cross-page sentence duplication, related-link resolution, slug safety,
division↔catalogue agreement, industry integrity, and — added with the form work —
that every division has a brief-form checkbox and every inquiry pathway preselects
a division that exists and is selectable.

**Two gate defects found and fixed while doing Phase 2/3:**

1. `verify` ran `smoke` before `build` while `dist/` is gitignored, so a fresh CI
   checkout died at `dist/index.html not found`. It now builds first.
2. `KNOWN` in the DOM suite is derived from data, but the division and flagship
   routes had no source entry — adding 69 routes without updating it produced 70
   false "broken link" reports. Both are now read from the catalogue's tier field
   and the division ids.

---

## 4b. Open blocker — the branch cannot be pushed

`git push origin arena/a7e1d1d1-the-office-web` is rejected:

```
refusing to allow a GitHub App to create or update workflow
`.github/workflows/verify.yml` without `workflows` permission
```

`.github/workflows/verify.yml` does not exist in the live tree (`84b1ba3`), on
`origin/main`, or in this branch's base (`7bfe8cd`). It was added in Phase 0, so
every commit since then carries it and GitHub refuses the whole branch — not just
that file. Nine commits and ~8,400 lines are currently local only.

Options, in order of preference:

1. **Grant the GitHub App `workflows` permission** for this repository, then push.
   The CI file is worth having: it is what stops the gate going stale again.
2. **Keep the workflow out of the branch.** Drop `.github/workflows/verify.yml`
   from the history (`git rebase` / filter) and commit it separately once the App
   can accept it. `npm run verify` still works locally and is unchanged.
3. Push through a credentialed account with workflow scope.

Until one of these happens the work is verifiable locally but not delivered, and
this is the single thing standing between the branch and review.

---

## 4d. Prerendering: what it found

Adding prerendering (Phase 6) exposed a defect class that was invisible while the
site was a pure SPA, because there was no server render to disagree with.

| Finding | Severity | Status |
|---|---|---|
| All 60 new routes served the homepage's title, canonical and `index, follow` with an empty body | Critical | Fixed — 96 routes prerendered |
| Every flagship page titled itself from its URL slug, not its service name | High | Fixed |
| Unknown URLs answered 200 with the homepage | High | Fixed — prerendered noindex 404 |
| `<noscript>` put a second `<h1>` ("JavaScript is off.") in all 97 documents | Medium | Fixed |
| A retained Portuguese visitor hit a hydration failure on every page | High | Fixed — language resolved pre-paint; hydration gated on language |
| The prerenderer dropped the mount node's closing `</div>` in all 96 files | High | Fixed + gated |
| `/services/intelligence` was absent from the DOM suite's route list | Medium | Fixed — sweep covers every shipped document |

**New gates, all negative-tested:** 96 routes re-render byte-identically to what
shipped; 97 documents are structurally balanced; every shipped internal link
resolves; every catalogue anchor exists; no default credential ships in a bundle;
the 404 is noindex and unstamped.

**A recurring lesson worth writing down:** four of my own checks were wrong before
they were right — a silently skipped check, a slice boundary that produced 96
false failures, a scan one directory deep covering 12 of 97 files, and a negative
test that patched a file the rebuild then replaced. Each initially reported
success or nonsense. A green check that has never been seen to fail is not
evidence.

---

## 4e. Performance: what the bundle split actually bought

The audit measured 191 KB of gzipped JavaScript on every route. Most of it was not
application logic — it was page content that only some routes render: 150 kB of
service detail copy, and the industry list. Every visitor parsed all of it to read
the homepage.

Five content-heavy pages are now loaded on demand (`src/App.tsx`), and
`src/data/serviceSlugs.ts` answers "does this slug have a detail page?" from the
catalogue so the entry bundle never pulls the detail index for that one bit.

| | Raw | Gzipped |
|---|---|---|
| **Before** — every route | 635,544 | 183,326 |
| Homepage, and any route without detail copy | 443,149 | 127,101 |
| Industry page (+ industry data) | 463,309 | 134,296 |
| Flagship service page (+ 137 kB of detail copy) | 590,409 | 174,911 |

The homepage is **30% smaller**; a flagship service page pays 45% less than before
because it no longer carries the other 39 pages' copy.

Two things this exposed, both now fixed and gated:

1. **Prerendering broke silently.** `renderToString` aborts the whole tree when it
   meets a lazy boundary and emits only the fallback, so 68 routes shipped as empty
   shells while the build still printed "96 routes prerendered". The SSR entry now
   uses `renderToPipeableStream` and waits for every boundary to settle.
   `smoke-ssr.mjs` had the failure in hand the moment it ran — the build's own
   success message was the misleading part.
2. **The extra `<Suspense>` cost hydration.** Wrapping the whole routed tree in a
   boundary looked harmless, but during hydration React defers a served boundary's
   contents to a later task. The reveal effect then wrote `is-visible` onto
   un-hydrated nodes, React discarded the server tree on every page, and the
   forms, typewriter and score all failed. The boundary now wraps only the lazy
   pages, and a hydration-mismatch assertion is what caught it.

**Cost of the split:** an industry page needs the lazy chunk before it is
interactive — ~360 ms in jsdom, which is the figure the DOM suite now waits on
rather than a fixed sleep. The markup itself is prerendered, so first paint is
unaffected; only interactivity waits.

---

## 4c. Decisions still needed from the client

Two things are deliberately not decided by me, because they are positioning and
budget calls rather than engineering ones.

**1. The homepage hero names three of six divisions.**
It reads "We do the work behind the book, the site, and the automation." That is
faithful to the approved wedge (publishing as the visible door) but it omits
growth, brand and technology consulting, which now have 21 published pages. The
options:

- *Leave it.* The wedge is doing its job: a book-shaped door into a six-division
  studio. The services index carries the full breadth.
- *Widen one word.* e.g. "behind the book, the site, and the business around it."
  Keeps the literary opening, covers the rest without listing divisions.
- *Lead with the method.* "Six divisions. One analytical method." — already the
  services headline; using it twice would flatten both.

My view: the second. It costs one word, keeps the wedge, and stops a visitor from
concluding the studio only does three things.

**2. Phase 4 storage — the one blocking technical choice.**
Lead storage plus the admin lead list and CRM pipeline need somewhere to write.
The brief specifies free tiers. Two candidates, both fine:

- **Vercel KV (Redis).** Fastest to wire into the existing `api/` functions, no
  migration tooling, generous free tier. Weak fit for the pipeline queries
  (filtering/sorting leads by stage) which are relational in nature.
- **Vercel Postgres (Neon).** Slightly more setup, SQL for the pipeline and CSV
  export, room for the Phase 7 CRM without a second migration.

My view: Postgres, because Phase 7 is explicitly in scope and re-platforming a
lead store mid-project is the expensive version of this decision.

Either way, no form work proceeds until one is picked — the standing rule is that
nothing may look like it saves data until it does.

---

## 5. What I will not do, and why

| Brief asks for | Why I am not building it as stated |
|---|---|
| 167 full pages | Self-contradicts "no superficial/doorway pages"; 40 flagship + 127 catalogue entries chosen instead (§2.1) |
| Industry pages implying sector experience | Would fabricate capability. Written as challenges/approach, no client claims |
| "CRM integration" | No CRM account, no API key. Phase 4 builds a real store first; a third-party CRM is a plug-in point, not a claim |
| "Client portal with RBAC" | Needs real auth (D7). Building it on `localStorage` would be theatre — explicitly what §30.10 forbids |
| Pricing figures | Everywhere the brief says "Request a Quote", I will keep "Request a Quote" |
| Multi-currency / international offices | No FX source and no international offices exist; I will not invent either |

---

## 6. Deliverables in this turn

| File | What it is |
|---|---|
| `docs/360/EXPANSION-AUDIT.md` | This document |
| `docs/360/service-catalog.json` | Machine-readable map: 6 divisions, 167 services with stable slugs and tiers, 20 industries. Includes a programmatic check that no slug collides with the 5 live service URLs |

**Nothing has been committed to the site.** No application code was changed, no UI touched. Awaiting
Q1–Q4 above, after which Phase 0 can start immediately and is a single day's work.

---

## 7. Honest limitations of this audit

- I verified `84b1ba3` by extracting it, installing it, and running `tsc`, `vite build`, `eslint` and
  the project's smoke suite. All pass except the 7 smoke assertions in D5.
- I did **not** deploy it, and I did **not** execute a Paystack transaction. **D2 is a code-level
  finding** (USD×100 sent to an API that documents `amount` in kobo); it should be confirmed against
  one test-mode transaction before the fix is closed.
- I could not run a headless browser (none in this sandbox), so responsive/visual claims are from code
  and shipped CSS, not screenshots.
- I did not audit the Portuguese translations' quality — only that they exist and switch `<html lang>`.
- The live domain's DNS/Vercel project settings were not inspected; D1 is established from what the
  domain actually serves, which is stronger evidence than the config anyway.
