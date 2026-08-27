# THE OFFICE — Production Studio Site

A production-grade site for THE OFFICE, a four-person studio for book strategy,
book research, web design, and automation.

The original brief is preserved in [`original_msg.eml`](original_msg.eml); the
audit and gap analysis against it lives in [`AUDIT.md`](AUDIT.md).

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 7 + Tailwind CSS 4 |
| Routing | Pathname router in `src/lib/router.ts` (no router dependency) |
| Backend | Vercel Serverless Functions (Node.js) |
| Email | Web3Forms (browser-direct) with a Resend server-side fallback |
| Validation | Zod |
| Hosting | Vercel |

## Routes

| Path | Renders | Notes |
|------|---------|-------|
| `/` | `HomePage` | Hero, services, work, approach, why, about, contact |
| `/work/:slug` | `CaseStudyPage` | One page per engagement, driven by `src/data/projects.ts` |
| `/notes` | `NotesPage` | Editorial index |
| `/notes/:slug` | `NotePage` | One page per note, driven by `src/data/notes.ts` |
| `/privacy` | `PrivacyPage` | |
| `/terms` | `TermsPage` | |
| anything else | `NotFound` | In-voice 404; reachable on a hard load via the catch-all rewrite |

Content lives in `src/data/` — adding a note, an engagement, a service or a
process stage is a data edit, not a component edit.

## Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── _lib/rate-limit.ts  # IP-based rate limiting (5 / 15 min)
│   ├── _lib/validate.ts    # Zod schemas + sanitization
│   ├── brief.ts            # POST /api/brief
│   └── health.ts           # GET /api/health
├── public/                 # Static assets, sitemap.xml, robots.txt, downloads
├── scripts/
│   ├── build-sitemap.mjs   # npm run sitemap — regenerates sitemap.xml from src/data
│   ├── smoke-ssr.mjs       # npm run smoke:ssr — renders every route in Node
│   └── smoke-api.mjs       # npm run smoke:api — drives the handlers with mock req/res
├── src/
│   ├── components/         # SiteHeader, SiteFooter, BriefForm, MarginRail, …
│   ├── data/               # services, projects, process, why, team, notes
│   ├── hooks/              # useToast, useDocumentMeta, useReveal
│   ├── lib/                # site constants, router, API client
│   ├── pages/              # Notes, Note, CaseStudy, Privacy, Terms
│   └── App.tsx             # Router + home page + 404
├── index.html              # Entry HTML with SEO + JSON-LD
├── vite.config.ts          # Vite + Tailwind + dev API middleware
└── vercel.json             # Security headers + SPA rewrites
```

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:5173
```

The Vite dev server also serves `/api/health` and `/api/brief` through the
middleware in `vite.config.ts` (it logs briefs rather than sending them). To
exercise the real serverless handlers locally:

```bash
npm run vercel:dev   # or: npx vercel dev
```

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server on `0.0.0.0:5173` |
| `npm run build` | `tsc && vite build` → `dist/` |
| `npm run lint` | Typecheck (`tsc --noEmit`) over `src`, `api` and `vite.config.ts` |
| `npm run eslint` | ESLint 9 flat config: typescript-eslint + react-hooks + jsx-a11y |
| `npm run smoke` | All three smoke suites — 121 reported checks |
| `npm run smoke:ssr` | Renders all 8 routes through the real `App` tree and asserts section content |
| `npm run smoke:api` | Drives `api/brief.ts` and `api/health.ts` with mock req/res |
| `npm run smoke:dom` | Bundles the real client entry and mounts it in jsdom per route |
| `npm run sitemap` | Regenerates `public/sitemap.xml` from `src/data/*.ts` |

### Testing

There is no test framework; the three smoke scripts are plain Node and run the
real code rather than mocks of it.

- **`smoke:ssr`** — server-renders every route through `App` and asserts the
  phase sections, the brief form fields, and the *absence* of the fabricated
  names and outcome claims that were removed.
- **`smoke:api`** — calls the actual handlers with mock `req`/`res`: CORS
  allowlist, honeypot, Zod field errors, rate limiting, health transitions.
- **`smoke:dom`** — esbuild-bundles `src/main.tsx` and mounts it in jsdom for
  each route. Asserts no console errors, per-route `title`/canonical/robots,
  exactly one `h1`, a `#main` landmark, no broken internal link, alt text on
  every image, skip link first in the tab order, the mobile menu opening and
  closing on Escape, empty-submit validation, and that a completed brief
  produces the right Web3Forms payload.

`smoke:dom` needs `dist/` — run `npm run build` first.

**Not covered:** jsdom has no layout engine, so horizontal overflow, computed
contrast and real focus-ring rendering are not measured. No browser binary can
be installed in this sandbox (the download hosts are network-blocked and the
npm-distributed Chromium is missing `libnss3`/`libnspr4`), so Core Web Vitals
and cross-breakpoint rendering remain visually unverified.

## Environment Variables

| Variable | Purpose | Where |
|----------|---------|-------|
| `WEB3FORMS_KEY` | Server-side form delivery key | Server |
| `VITE_WEB3FORMS_KEY` | Browser-side form delivery key (public by design) | Client |
| `RESEND_API_KEY` | Optional server-side delivery from a verified domain | Server |
| `TO_EMAIL` | Brief recipient | Server |
| `FROM_EMAIL` | Verified Resend sender | Server |
| `CORS_ORIGIN` | Comma-separated origins allowed to call `/api/brief` | Server |
| `VITE_SITE_URL` | Canonical origin for meta tags and the sitemap | Client |

The Web3Forms key is public by design — that is how the service works. It is
held in exactly one place (`src/lib/site.ts`) instead of being duplicated across
client and server files.

## Email Delivery

1. The browser posts straight to Web3Forms, so a brief reaches
   `theofficetechies@gmail.com` even if the serverless function is not deployed.
2. If that fails, the client falls back to `POST /api/brief`.
3. `/api/brief` tries Web3Forms, then Resend, and returns **503** if neither is
   configured — it never reports success for a brief it dropped.

## Deployment

1. Push the repository to GitHub and import it in Vercel.
2. Add the environment variables above in **Project Settings → Environment Variables**.
3. Set `CORS_ORIGIN` to your production origin. `*.vercel.app` previews and
   localhost are permitted automatically.
4. When the custom domain goes live, update `VITE_SITE_URL`, re-run
   `npm run sitemap` with `SITE_URL`, and update `index.html` and
   `public/robots.txt`.

## Security

- **Rate limiting** — 5 submissions per 15 minutes per IP, with `X-RateLimit-*` headers
- **Honeypot field** — hidden field catches bots, which get a silent 200
- **Input sanitization** — HTML tags stripped from all text inputs
- **Zod validation** — strict schema on the backend, mirrored in the client
- **CORS allowlist** — unknown origins get 403 and no `Access-Control-Allow-Origin`
- **Security headers** — set in `vercel.json` and re-applied by `/api/brief`
- **No trackers** — no analytics, no ad networks, one localStorage preference

## Honesty Policy

The brief in `original_msg.eml` forbids fabricating clients, results,
testimonials, awards or identities. That is enforced structurally:

- `src/data/projects.ts` entries are **engagement patterns**. `client` and
  `result` fields only render when `verified: true`, so an unverified entry
  cannot claim a result.
- `src/data/team.ts` cards render role-first. `name`, `portrait` and `link`
  render only when a seat sets `verified: true`.
- There are no testimonials. The "Why" section publishes commitments instead.
- The one downloadable report is a real deliverable, published in full.

To publish verified identities or case studies, fill in those fields and flip
the flag — the components pick them up with no other change.

## Accessibility

- Skip-to-content link on every route
- Semantic landmarks, one `h1` per page, labelled regions
- `aria-invalid` / `aria-describedby` / `role="alert"` on the brief form
- Visible focus rings, inverted to white inside black sections (`.on-ink`)
- `prefers-reduced-motion` short-circuits the typewriter and scroll reveals
- Reveal animations are scoped behind a `.js` class, so a no-JS visitor never
  sees hidden content

## License

Private — All rights reserved.
