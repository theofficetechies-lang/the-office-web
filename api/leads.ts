/**
 * Lead list for the admin panel (Phase 4, D4).
 *
 * This endpoint returns customer data, so it is authenticated — and the honest
 * description of that authentication is: a shared passcode sent by the caller,
 * compared in constant time. It is not user accounts, it is not sessions, and it is
 * not per-person access control. Setting a passcode is what closes D7b *temporarily*;
 * real accounts remain Phase 8.
 *
 * Design notes that matter:
 *
 *  - The passcode is a server-side secret (`ADMIN_PASSCODE`). It is NEVER a
 *    `VITE_`-prefixed variable, because those are compiled into the browser bundle
 *    and would be readable by anyone. The old store admin used `VITE_ADMIN_PASSCODE`
 *    to gate a client-side view; that is fine for hiding a UI and useless for
 *    protecting a database, so this endpoint does not accept it.
 *  - Comparison is constant-time over equal-length digests, so response timing does
 *    not leak how many characters matched.
 *  - With no passcode configured the endpoint returns 503 and no data. It never
 *    falls open, and it does not invent a default.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, timingSafeEqual } from "node:crypto";
import { rateLimit } from "./_lib/rate-limit.js";
import { send, noContent } from "./_lib/respond.js";
import { resolveLeadStore, LEAD_STAGES } from "./_lib/leads.js";
import type { LeadStage } from "./_lib/leads.js";

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "https://www.the-office360.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function originAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  if (origin && originAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Passcode");
  res.setHeader("Access-Control-Max-Age", "86400");
}

/**
 * Constant-time passcode check.
 *
 * Hashing both sides first makes the comparison length-independent (a digest is
 * always 32 bytes), so an attacker cannot infer the configured length from timing.
 */
function passcodeMatches(supplied: string, expected: string): boolean {
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return noContent(res);
  if (req.method !== "GET") {
    return send(res, 405, { success: false, error: "Method not allowed" });
  }

  const origin = req.headers.origin as string | undefined;
  if (origin && !originAllowed(origin)) {
    return send(res, 403, { success: false, error: "Origin not allowed" });
  }

  const expected = (process.env.ADMIN_PASSCODE ?? "").trim();
  if (!expected) {
    return send(res, 503, {
      success: false,
      error: "The lead list is not configured on this deployment.",
      code: "admin_not_configured",
    });
  }

  const supplied = String(req.headers["x-admin-passcode"] ?? "").trim();
  if (!supplied || !passcodeMatches(supplied, expected)) {
    /* Count failures against the same limiter so this cannot be brute forced. */
    const limit = rateLimit(req);
    if (!limit.success) {
      return send(res, 429, { success: false, error: "Too many requests. Try again in 15 minutes." });
    }
    return send(res, 401, { success: false, error: "Passcode rejected." });
  }

  const store = resolveLeadStore();
  if (!store) {
    return send(res, 503, {
      success: false,
      error: "No lead database is configured on this deployment.",
      code: "storage_not_configured",
    });
  }

  const rawLimit = Number(req.query.limit);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 100;

  const rawStage = String(req.query.stage ?? "");
  const stage = (LEAD_STAGES as readonly string[]).includes(rawStage)
    ? (rawStage as LeadStage)
    : undefined;
  if (rawStage && !stage) {
    return send(res, 400, {
      success: false,
      error: `Unknown stage. Expected one of: ${LEAD_STAGES.join(", ")}`,
    });
  }

  try {
    const [leads, total] = await Promise.all([store.list({ limit, stage }), store.count()]);
    return send(res, 200, { success: true, total, returned: leads.length, stage: stage ?? null, leads });
  } catch (err) {
    console.error("[Leads API] list failed:", err);
    return send(res, 502, { success: false, error: "Could not read the lead database." });
  }
}
