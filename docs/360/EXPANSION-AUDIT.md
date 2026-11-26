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
| 4 — Lead infrastructure | **Built, needs a database to activate** | Postgres chosen (§4c.2); `api/_lib/leads.ts`, `api/leads.ts`, `/admin/leads` and `npm run db:migrate` all land and pass the API suite. Set `DATABASE_URL` + `ADMIN_PASSCODE` to switch on |
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

## 4b. Resolved — the branch is pushed

`git push` was rejected for the entire project until now:

```
refusing to allow a GitHub App to create or update workflow
`.github/workflows/verify.yml` without `workflows` permission
```

Commit `58233d4` (Phase 0) added `.github/workflows/verify.yml`. The App this
repository is used with has no `workflows` permission, so GitHub refused the whole
branch — every commit, not just that file — and 31 commits sat local-only while the
work stayed verifiable but undelivered.

**Fixed by rewriting the branch to drop that one file from history** (decision made
by the client rather than granting the permission). The `--index-filter` removed the
path from all 31 commits; old and new HEAD differ by exactly that file and nothing
else, which was verified by diffing the two trees. The workflow itself is preserved
byte-identical at `docs/360/ci/verify.yml`, with activation instructions, so the
work is parked rather than lost.

The branch now pushes cleanly. **The CI workflow is still not active** — until
someone with workflow scope moves it back, `npm run verify` remains a local habit
rather than an enforced gate.

## 4c. Decisions — both resolved

**1. The homepage hero named three of six divisions. Decided: widen one word.**
It now reads "We do the work behind the book, the site, and the business around
it." The literary opening survives, growth, brand and technology consulting are
covered without listing divisions, and a visitor no longer concludes the studio
does three things. Portuguese updated to match. The alternative — "Six divisions.
One analytical method." — was rejected because it is already the services headline
and using it twice would flatten both.

**2. Phase 4 storage. Decided: Postgres (Neon).**
SQL for the lead pipeline and CSV export, and room for the Phase 7 CRM without a
second migration. Redis would have been faster to wire into the existing `api/`
functions, but the pipeline queries are relational and re-platforming a lead store
mid-project is the expensive version of this decision.

**Phase 4 is therefore unblocked.** D4 (no lead persistence) is the next thing to
build, and the standing rule still holds: no form may look like it saves data until
it does.

### 4c.3 Lead persistence — what was built, and the rule it enforces

D4 was the top item in the §29 review. It is now implemented, and one rule runs
through the whole design: **a brief may never be reported as saved unless it was.**

That sounds obvious and it is the thing most lead forms get wrong. Before this, a
brief was emailed and forgotten — not counted, not filterable, not exportable, lost
the moment the inbox was tidied. Now:

- **Persist first, deliver second.** The row is the durable record; the email is a
  notification about it. The old order meant a provider outage lost the enquiry.
- **Email failure after a successful write is a success.** The enquiry is safe, only
  the notification failed. Telling the visitor it failed would make them send it
  again and create a duplicate. The failure is logged for us instead.
- **No database means `stored: false`, not a hopeful `true`.** The response carries
  the distinction and the API suite asserts both directions — a handler that always
  claims success fails the suite, which it did not before I tightened the test.
- **Parameterised SQL, sanitised on the way in.** A brief containing
  `<script>alert(1)</script>` is stored as text and comes back without the tag.

**Storage** is Postgres (Neon) over HTTP rather than a socket driver, because a
connection pool in a serverless function is a cold-start liability. Values are
`$1..$n`; the connection string is sent as a header, never interpolated into a URL
that could be logged.

**Access** is a server-side `ADMIN_PASSCODE`, compared in constant time over
SHA-256 digests so timing does not leak length. It is deliberately *not* the
`VITE_`-prefixed variable the store admin uses: that one is compiled into the public
bundle and is a door on a public room, which is fine for hiding a preview UI and
useless for protecting a database. With `ADMIN_PASSCODE` unset, `/api/leads` returns
503 and serves nothing — it never falls open and has no default.

**A bug this found in my own tests, worth recording.** The API suite sets
`process.env.WEB3FORMS_KEY` after importing the handler, but `brief.ts` captured
that value in a top-level `const` — so every "delivery" test was silently exercising
the *no provider* branch and passing for the wrong reason. The key is now read per
request. The suite only caught this because `stored:false` appeared where
`stored:true` was expected. Two of the three success paths were also missing the
flag entirely; both are fixed and asserted.

**Still required to go live:** a Neon database, `DATABASE_URL`, `ADMIN_PASSCODE`,
and `npm run db:migrate` (idempotent, verifies the table afterwards). None of that
is a subscription I can create, so this is "built and tested, awaiting credentials"
rather than "done".

---

### 4f. Transformation brief — repositioning applied

The client supplied a second, later brief that repositions the studio as a digital
transformation consultancy. It supersedes the literary-studio framing. What changed
in code, and what did not:

**Applied in full**

| Brief requirement | Implemented |
|---|---|
| Hero: "Transform Your Business. Engineer Your Digital Future." | Yes — three-line h1, both clauses now asserted by a gate |
| Primary CTA "Explore Our Services", secondary "Book a Free Consultation" | Yes, both real destinations |
| Nav: HOME · ABOUT · SERVICES · INDUSTRIES · OUR WORK · INSIGHTS · CONTACT | Yes (HOME is the wordmark) |
| `/about` with philosophy, methodology, why-us, team | New page |
| `/contact` with consultation / proposal / audit paths | New page, wired to the real inquiry pathways |
| `/insights` editorial index | New page over the existing notes, grouped by their own category |
| `/work` portfolio index | New page, honest about unverified patterns |
| Six divisions matching Divisions A–F | Already built in Phase 2 |
| SEO + structured data | Already built; 100 routes now |

**Deliberately not done, and why**

- **No invented staff.** The brief wants an international consultancy; the studio is
  four verified principals. `/about` states both plainly and explains how four
  people cover six divisions. Inflating the team is the one change that would make
  every other claim on the site worthless.
- **No client names or results on `/work`.** All five entries are `verified: false`
  engagement patterns. The index says so above the fold rather than in a footnote.
- **No fabricated pricing.** Still "Request a custom quote" where no approved number
  exists.
- **Portal, CMS and booking remain deferred** per the earlier instruction; the
  brief's Phase 10 items are architected around, not faked.

**What rewriting the positioning exposed.** Five separate places claimed "four-person
studio" as identity rather than fact — the manifest bar, the footer, the press
sheet, the homepage margin rail and the meta description. Repositioning the hero
without fixing those would have produced a site that said "digital transformation
consultancy" at the top and "small book studio" at the bottom. All five now read
"four principals, six divisions", which is true and survives the new positioning.

**Regression caught by the suite.** `/about` shipped an invalid `<dl>` (a numbered
eyebrow as a sibling of `dt`/`dd`), which axe flagged as `definition-list` and
`dlitem`. Fixed. The link sweep also flagged ~400 false "broken link" reports until
the four new routes were added to its known-route list — the same stale-list failure
mode recorded in §4d, caught this time before commit.

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

## 29. Final quality review — eight readers, one shipped site

The brief's last section asks for a second independent audit after implementation,
reviewed as eight different people, followed by a 28-point release checklist. This
is that review. It is written against the built site (`dist/`, 96 documents), not
against the plan — every claim below is one I re-verified this turn.

The value of doing it this way is that the eight readers disagree. Where they do,
I say so rather than averaging them into a score.

### A. Creative Director

**Reads for:** does this look like a studio with a point of view, or a well-built
template?

The system holds together. Fraunces for display against Inter Tight and JetBrains
Mono, warm paper (`#f4f3ef`) rather than pure white, black rules doing the dividing
work instead of cards and shadows, one restrained accent reserved for live markers.
The margin rail is the signature move: it makes the page feel edited rather than
assembled, and it is used consistently enough to read as a system rather than a
one-page flourish.

The typography is doing most of the work and it earns it — 194 `sm:` and 67 `lg:`
responsive type adjustments across the homepage alone mean headlines do not simply
scale down, they re-compose.

**Weakness it would raise:** the site has no photography of its own. The only
images are 4 team portraits and 5 product covers — 14 `<img>` tags across 96 pages.
For a studio selling judgement, that is defensible (nothing is faked) but it means
the visual memory of the site is entirely typographic. That is a deliberate
position, not an oversight, and I would defend it — but a client will notice.

### B. Potential Client

**Reads for:** can I tell what they do, whether they are serious, and what it costs?

This is where the earlier phases did the most work. 40 flagship service pages, 6
division hubs, 20 industry pages, 10 inquiry pathways, and a 172-service catalogue
all reachable in three clicks from the homepage. The five published services keep
their original pages. Prices are never invented: the store names a product and
"Request a Quote"; nothing invents a number.

**Weakness it would raise:** the hero used to name three of six divisions, so a
client who only read the fold concluded the studio did books, sites and automation.
That is fixed (§4c.1) — the line now ends "and the business around it", which covers
growth, brand and consulting without turning the fold into a list.

### C. UX Designer

**Reads for:** is the path from arrival to enquiry obvious, and does anything
surprise me?

Every route now ends in the same contact machinery, and the inquiry pathway
pre-selects exactly one division so the form arrives already knowing why the
visitor is there. The 404 is a real page in the house voice ("That sector is not in
the archive") rather than an apology, and every unknown URL gets it with `noindex`.

**Weakness it would raise:** there are two contact surfaces — the homepage brief
form and the pathway-driven form — and I would want to watch five real sessions
before claiming that reads as one experience rather than two. That is a research
task, not a build task, and I would not fake the finding.

### D. Mobile User

**Reads for:** does it work with one thumb.

Five breakpoints (`40/48/64/80/96rem`), 270 responsive utility applications, a
mobile folio strip in place of the desktop margin rail, and — as of this turn — a
global horizontal-overflow guard, since a single unbroken string in editorial copy
will scroll a narrow viewport sideways and drag every fixed element with it.

**Weakness it would raise:** I cannot honestly certify touch behaviour from jsdom.
The DOM suite proves markup, labels, states and hydration on 96 documents; it does
not prove that a tap target is 44px or that a swipe feels right. That needs a real
device, and I have said so rather than marking the box.

### E. SEO Specialist

**Reads for:** what does a crawler see with JavaScript switched off?

Now: the full page. 96 documents are prerendered with route-specific `<title>`,
canonical, Open Graph, `hreflang` and JSON-LD; every one re-renders byte-identically
to what shipped. Schema coverage is 96 ProfessionalService, 96 WebSite, 85
BreadcrumbList, 45 Service, 40 FAQPage, 8 Article, 8 CollectionPage — all gated for
validity, all negative-tested.

All 96 routes are reachable from `/` within three hops, which was 28 of 96 before
the crawlability work. The 404 is `noindex`. The sitemap lists 96 URLs with no
duplicates.

**Weakness it would raise:** the work pages are honest but thin for a category —
5 pages, all marked `verified: false` as engagement patterns rather than client
cases, each carrying a `disambiguatingDescription` so no schema claims a client
that does not exist. That is the correct ethical call and it is also, unavoidably,
a weaker ranking signal than fabricated case studies would be. No analytics is
wired yet, so nothing here is measured against real search demand.

### F. Accessibility Specialist

**Reads for:** can a keyboard and screen-reader user complete every task.

Verifiable and verified: 96/96 pages pass the static gate; landmark structure is
clean on all 96 (exactly one `<main>`, one `<header>`, one `<footer>`, one `<nav>`
with an aria label each); heading order never skips a level across any of the 96
documents; skip link reveals on focus; inverse sections get their own focus ring;
`prefers-reduced-motion` is honoured; every image has an `alt`. Ten real defects
were fixed this stretch — the store checkout's name and email inputs were labelled
only by placeholder.

**Weakness it would raise:** analysis is not a screen reader. axe-core now runs
over all 96 documents and found two real defects that regexes missed — a prohibited
`aria-label` that left the hero line with no accessible name, and duplicate `<nav>`
labels — which is exactly the class of bug a rule engine catches and a pattern match
does not. But axe in jsdom has no layout, so contrast and target size are excluded
by name rather than passing, and neither a rule engine nor a static pass can tell you
whether a live region announces at the wrong moment. I would not ship to a client
claiming WCAG AA on the strength of automated checks alone, and I am not claiming it
here.

### G. Frontend Engineer

**Reads for:** will this rot.

`npm run verify` is the answer, and it is one command: typecheck, lint, origin
guard, money contract (24 assertions), content integrity, build, then SSR, API and
DOM suites. The gates are adversarial — a check that has never been seen to fail is
not evidence, so most of them were negative-tested by deliberately breaking the
thing they guard. Several caught real regressions this stretch, including two
introduced by the bundle split itself: 68 routes silently lost their prerendered
markup, and an outer `<Suspense>` broke hydration on every page.

**Weakness it would raise:** the DOM suite runs in jsdom, so it cannot see layout,
paint, or touch. The branch is now pushed (§4b), but the CI workflow it was written
to run is parked at `docs/360/ci/verify.yml` and inactive — so the gate is still a
local habit rather than something that stops a bad commit reaching main.

### H. Conversion Specialist

**Reads for:** what happens after someone decides to act.

Ten inquiry pathways, each pre-selecting a division; the brief form tags every
submission by division and pathway so routing has something to route on when
storage exists; Web3Forms delivery is wired and asserted end to end in the DOM
suite, including the honeypot travelling empty and the backend mirror.

**Weakness it would raise:** nothing is stored yet. D4 is open, so a lead that
arrives by email is not in a pipeline, cannot be counted, and cannot be followed up
systematically — and the admin panel says so plainly rather than showing a fake
list. This is still the biggest commercial gap: **the site is complete enough to
generate enquiries it cannot yet track.** The storage decision that gated it is now
made (Postgres, §4c.2), so this is build work rather than a blocked item.

### The consensus

Three of eight independently named the same top item: **no lead persistence** (D4) —
still open, and now unblocked. Two named the **hero division wording** (§4c) — fixed. One named the **push blocker** as the
top risk, which is the only item that blocks everything else from mattering.

Ranked, the work I would do next is: push the branch, decide storage, widen the
hero line, wire analytics, then a real-browser pass for contrast, touch targets and
Core Web Vitals — the three things jsdom structurally cannot see.

## 29.1 The release checklist, stated honestly

The brief lists 28 conditions. I am not going to tick all 28, because three of them
cannot be established from a build tree, and marking them done would be the exact
dishonesty this project has spent its effort avoiding.

**Verified, with a gate behind it — 25 of 28:**

Desktop · Tablet · Navigation · Hero · Services · Process · Work section ·
About/team · Why THE OFFICE · Notes section · Contact experience · Footer ·
404 page · SEO · Accessibility · Responsive typography · Hover states ·
Focus states · Loading states · Error states · Reduced motion · No fabricated
information · No broken links · No unintended placeholders · No horizontal overflow

Evidence, not assertion: five shipped media queries (`40/48/64/80/96rem`) and 270
responsive utility applications; 96/96 documents with exactly one `<main>`,
`<header>`, `<footer>` and labelled `<nav>`; no heading-order skip on any of the 96;
skip link, focus rings and `prefers-reduced-motion` asserted from the shipped CSS;
`.skip-link:focus` and `.on-ink` focus treatment gated; 14 images, all with `alt`,
all lazy; the overflow guard added this turn and negative-tested.

Accessibility is now checked twice. A regex pass covers the cheap invariants, and
**axe-core runs over all 96 shipped documents** with zero violations. That second
pass earns its place: it immediately found two defects the regexes could not see —
an `aria-label` on a role-less `<span>` in the hero typewriter (prohibited, so
silently ignored; the line had no accessible name at all) and two `<nav>` landmarks
both labelled "Services". Both are fixed, and both were reintroduced deliberately to
prove the gate fails on them.

**Partly verified — 2 of 28. Both are verified in markup and unverifiable in
behaviour without a browser or a device:**

| Condition | What is proven | What is not |
|---|---|---|
| Mobile experience | Five breakpoints, mobile folio strip, responsive type, overflow guard, every route mounts and hydrates cleanly in a 96-document sweep | Touch target sizes, gestures, and real-device paint. jsdom has no layout engine and no touch input |
| No console errors | Zero console errors and zero hydration mismatches on every mounted route | jsdom is not a browser. A real-browser pass is still outstanding |

**Not verified — 1 of 28:**

| Condition | Status | Why |
|---|---|---|
| Performance / Core Web Vitals | **Measured, not certified** | The bundle is gated — 127 KB gz first load, 30% below the pre-split figure, 45% below on flagship service pages — but LCP, CLS and INP require a real browser against a deployed URL |

**On axe specifically:** it runs in jsdom, which has no layout engine, so
`color-contrast` and `target-size` report *incomplete* rather than clean. Those are
excluded by name in the gate so the pass cannot be read as broader than it is.
Contrast and touch targets still need a real browser, and that is stated here rather
than buried.

**One further caveat on "No unintended placeholders":** there is no lorem, no TODO
and no "coming soon" anywhere in shipped copy. `/admin` renders a deliberate,
labelled not-configured state — it is a described absence, not a placeholder
standing in for something that was meant to be finished.

**Genuinely open, though not checklist items:** analytics events are unwired (the
Phase 6 remainder), lead persistence is D4, customer auth is D7b (email-only), the
webhook/entitlement path is D8, and Phase 8 is deferred as instructed.

**My own view of the result:** the site is complete enough to send to a serious
client, with two caveats I would state to that client rather than let them find —
enquiries are not stored yet, and nothing is measured yet. Everything visible is
real: no invented clients, no invented prices, no invented results, and where the
product cannot do something the page says so.

---

## 29.2 Design audit — "strictly no AI-type designs"

Asked directly whether this looks like an AI-generated site. An honest answer needs
evidence, not assurance, so this is the checklist of what generic AI design actually
looks like, measured against the shipped build.

| Generic-AI tell | This site | Measured |
|---|---|---|
| Purple/blue gradient hero | None | **0** `linear-gradient` rules in 38 KB of CSS |
| Glassmorphism / frosted cards | None | **0** `backdrop-filter` declarations |
| Rounded card soup | None | Only radius is `0` and `9999px` (true circles for portraits) — no `8/12/16px` card radii |
| Drop shadows everywhere | None | The only `box-shadow` tokens are `none` and Tailwind's ring variables |
| Emoji as icons | None | **0** emoji on the homepage; **0** inline `<svg>` — iconography is typographic |
| Centered text, three-up feature grid, "Lorem ipsum" swap | No | 13 distinct structural signatures across 96 pages |
| Animation everywhere | No | **2** `@keyframes` in the entire stylesheet (caret blink, toast) |
| Stock-photo hero | No | 14 images total, all portraits and product covers — no stock |
| Generic SaaS font stack | No | Fraunces / Inter Tight / JetBrains Mono, self-specified tokens |
| Boilerplate copy repeated page to page | No | 4% of sentences shared across pages, and the largest legitimate cluster is the disclaimer |

**What it is instead.** A restrained editorial system: warm paper `#f4f3ef` against
pure white, deep charcoal type, one accent (`#8a3324`) reserved for live markers,
black hairlines doing the dividing work instead of cards. Fraunces display type at
112px against JetBrains Mono micro-labels. The signature elements are the
**margin rail** (a persistent editorial annotation column) and the **typewriter
headline** — neither is a component you get from a template.

**The honest counterweight.** The brief asked for "subtle gradients", "smooth
interactions", "premium navigation" and a "technology-driven" feel. This build has
**no gradients at all** and only two animations. That is a deliberate divergence:
the client's closing instruction was "strictly no AI-type designs", and gradient
hero + glass cards + rounded everything *is* the AI-design signature. I kept the
restraint and can justify each omission — but if "premium technology consultancy"
reads to you as needing a cooler, more gradient-lit palette, that is a real design
decision to make explicitly rather than something I should quietly change.

**What I could not verify:** contrast ratios and visual appearance itself. There is
no browser in this environment (§32); axe-core runs structurally and its contrast
rule is excluded because jsdom has no layout. The live preview is the way to judge
this — my measurements can support a claim about *restraint*, not about *beauty*.

---

## 30. What I will not do, and why

| Brief asks for | Why I am not building it as stated |
|---|---|
| 167 full pages | Self-contradicts "no superficial/doorway pages"; 40 flagship + 127 catalogue entries chosen instead (§2.1) |
| Industry pages implying sector experience | Would fabricate capability. Written as challenges/approach, no client claims |
| "CRM integration" | No CRM account, no API key. Phase 4 builds a real store first; a third-party CRM is a plug-in point, not a claim |
| "Client portal with RBAC" | Needs real auth (D7). Building it on `localStorage` would be theatre — explicitly what §30.10 forbids |
| Pricing figures | Everywhere the brief says "Request a Quote", I will keep "Request a Quote" |
| Multi-currency / international offices | No FX source and no international offices exist; I will not invent either |

---

## 31. Deliverables in this turn

| File | What it is |
|---|---|
| `docs/360/EXPANSION-AUDIT.md` | This document |
| `docs/360/service-catalog.json` | Machine-readable map: 6 divisions, 167 services with stable slugs and tiers, 20 industries. Includes a programmatic check that no slug collides with the 5 live service URLs |

**Nothing has been committed to the site.** No application code was changed, no UI touched. Awaiting
Q1–Q4 above, after which Phase 0 can start immediately and is a single day's work.

---

## 32. Honest limitations of this audit

- I verified `84b1ba3` by extracting it, installing it, and running `tsc`, `vite build`, `eslint` and
  the project's smoke suite. All pass except the 7 smoke assertions in D5.
- I did **not** deploy it, and I did **not** execute a Paystack transaction. **D2 is a code-level
  finding** (USD×100 sent to an API that documents `amount` in kobo); it should be confirmed against
  one test-mode transaction before the fix is closed.
- **No headless browser, and this is now a measured limit rather than a shrug.** There is no browser
  in this sandbox and none can be fetched: `registry.npmjs.org` is reachable, so `playwright-core`
  installs, but the browser binaries come from `cdn.playwright.dev` / `storage.googleapis.com` and
  every one of those hosts resets the connection. So contrast, touch-target size and Core Web Vitals
  are the three things this environment structurally cannot check. Everything checkable without
  layout *is* checked — axe-core over all 96 documents, plus the regex gate — and the two were kept
  deliberately separate so the jsdom pass is never read as a real-browser pass.
- I did not audit the Portuguese translations' quality — only that they exist and switch `<html lang>`.
- The live domain's DNS/Vercel project settings were not inspected; D1 is established from what the
  domain actually serves, which is stronger evidence than the config anyway.
