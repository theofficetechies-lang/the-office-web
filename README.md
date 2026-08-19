# THE OFFICE — Production Studio Site

A production-grade landing page for THE OFFICE, a four-person studio for book strategy, web design, automation, and book research.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 7 + Tailwind CSS 4 |
| Backend | Vercel Serverless Functions (Node.js) |
| Email | Resend |
| Validation | Zod |
| Hosting | Vercel |

## Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── _lib/               # Shared backend utilities
│   │   ├── rate-limit.ts   # IP-based rate limiting
│   │   └── validate.ts     # Zod schemas + sanitization
│   ├── brief.ts            # POST /api/brief (form handler)
│   └── health.ts           # GET /api/health (status check)
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks (useToast)
│   ├── lib/                # Frontend utilities (API client)
│   └── utils/              # Helpers (cn)
├── public/                 # Static assets
├── index.html              # Entry HTML with SEO
├── vite.config.ts          # Vite + Tailwind config
├── vercel.json             # Vercel deployment config
└── .env.example            # Environment variable template
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A [Resend](https://resend.com) account (free tier works)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required for production:

- `RESEND_API_KEY` — Your Resend API key
- `TO_EMAIL` — Where brief notifications are sent
- `FROM_EMAIL` — Verified sender in Resend

### Local Development

Run the Vite dev server:

```bash
npm run dev
```

The frontend will be at `http://localhost:5173`.

To test the API locally, use Vercel's local development environment:

```bash
npm run vercel:dev
# or
npx vercel dev
```

This serves both the frontend and API routes together.

### Build

```bash
npm run build
```

Output goes to `dist/`.

## Deployment

### Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the environment variables in **Project Settings → Environment Variables**.
4. Deploy.

### Environment Variables on Vercel

| Variable | Value Example | Environment |
|----------|--------------|-------------|
| `RESEND_API_KEY` | `re_xxxxxxxx` | Production, Preview |
| `TO_EMAIL` | `theoffice@gmail.com` | Production, Preview |
| `FROM_EMAIL` | `onboarding@resend.dev` | Production, Preview |

### Custom Domain

Update `CORS_ORIGIN` in `api/brief.ts` to match your production domain:

```ts
const CORS_ORIGIN = "https://theoffice.studio";
```

Also update the canonical URL and Open Graph meta tags in `index.html`.

## API Endpoints

### `POST /api/brief`

Submits a project brief. Validates input, checks rate limits, and sends an email via Resend.

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "org": "Example Press",
  "service": "book-strategist",
  "brief": "We need help positioning a debut novel...",
  "company_website": "" // honeypot — leave empty
}
```

**Responses:**

- `200` — Brief received and emailed
- `400` — Validation failed (see `issues` array)
- `429` — Rate limited (5 requests per 15 minutes)
- `502` — Email provider error

### `GET /api/health`

Returns service health status and configuration checks.

## Security Features

- **Rate limiting** — 5 submissions per 15 minutes per IP
- **Honeypot field** — Hidden field to catch bots
- **Input sanitization** — Strips HTML tags from all text inputs
- **Zod validation** — Strict schema validation on the backend
- **Security headers** — X-Frame-Options, CSP, Referrer-Policy, etc.
- **CORS** — Restricted to production domain
- **No cookies by default** — Analytics are opt-in

## Production Checklist

- [ ] Set up Resend account and verify sender domain
- [ ] Add environment variables to Vercel
- [ ] Update `CORS_ORIGIN` in `api/brief.ts`
- [ ] Update canonical URL in `index.html`
- [ ] Update Open Graph image URL in `index.html`
- [ ] Replace `/privacy` and `/terms` stub routes with real pages
- [ ] Configure custom domain in Vercel
- [ ] Set up Plausible/Fathom analytics if desired
- [ ] Remove `ENABLE_DEV_EMAIL` from production env

## License

Private — All rights reserved.
