import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const checks = {
    resend: Boolean(process.env.RESEND_API_KEY),
    toEmail: Boolean(process.env.TO_EMAIL),
  };

  const healthy = checks.resend && checks.toEmail;

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV ?? "development",
    checks,
  });
}
