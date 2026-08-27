import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * GET /api/health
 *
 * Reports whether at least one delivery path for brief submissions is
 * configured. The browser posts to Web3Forms directly, so a deployment with
 * only the client-side key still works — `web3FormsClient` covers that, and
 * `web3FormsServer` / `resend` describe the server-side fallback.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const checks = {
    web3FormsServer: Boolean(
      process.env.WEB3FORMS_KEY || process.env.WEB3FORMS_ACCESS_KEY
    ),
    resend: Boolean(process.env.RESEND_API_KEY),
    toEmail: Boolean(process.env.TO_EMAIL),
  };

  const canDeliver = checks.web3FormsServer || checks.resend;
  const healthy = canDeliver && checks.toEmail;

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV ?? "development",
    checks,
  });
}
