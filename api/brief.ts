import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { rateLimit } from "./_lib/rate-limit.js";
import { briefSchema, sanitizeText } from "./_lib/validate.js";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const web3FormsKey =
  process.env.WEB3FORMS_KEY || process.env.WEB3FORMS_ACCESS_KEY || "";
const TO_EMAIL = process.env.TO_EMAIL ?? "theofficetechies@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
const ENV = process.env.VERCEL_ENV ?? "development";

/**
 * CORS allowlist. Set CORS_ORIGIN to a comma-separated list of production
 * origins; Vercel preview deployments (*.vercel.app) and local development are
 * permitted so previews and `vercel dev` work without extra configuration.
 */
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "https://the-office-test4.vercel.app")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function originAllowed(origin: string | undefined): boolean {
  if (!origin) return true; // server-to-server / non-browser callers
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
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function setSecurityHeaders(res: VercelResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);
  setSecurityHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const origin = req.headers.origin as string | undefined;
  if (origin && !originAllowed(origin)) {
    return res.status(403).json({ success: false, error: "Origin not allowed" });
  }

  // Rate limiting
  const limit = rateLimit(req);
  res.setHeader("X-RateLimit-Limit", String(limit.limit));
  res.setHeader("X-RateLimit-Remaining", String(limit.remaining));
  res.setHeader("X-RateLimit-Reset", String(limit.reset));

  if (!limit.success) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please try again in 15 minutes.",
    });
  }

  // Honeypot check
  const rawBody = req.body ?? {};
  if (rawBody.company_website && String(rawBody.company_website).trim().length > 0) {
    // Silently accept so bots don't retry
    return res.status(200).json({
      success: true,
      message: "Brief received. We reply within two working days.",
    });
  }

  // Validation
  const parse = briefSchema.safeParse(rawBody);
  if (!parse.success) {
    const issues = parse.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return res.status(400).json({ success: false, error: "Validation failed", issues });
  }

  const data = parse.data;

  // Sanitize
  const safeName = sanitizeText(data.name);
  const safeOrg = data.org ? sanitizeText(data.org) : undefined;
  const safeBrief = sanitizeText(data.brief);
  const safeService = data.service ? sanitizeText(data.service) : "";
  const safeScope = data.scope ? sanitizeText(data.scope) : "";

  // 1. Web3Forms — delivers straight to the inbox without a verified domain.
  if (web3FormsKey) {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `Brief from ${safeName}${safeOrg ? ` · ${safeOrg}` : ""}`,
          from_name: "THE OFFICE Studio Web",
          name: safeName,
          email: data.email,
          organization: safeOrg || "None",
          service: safeService || "General Inquiry",
          timeline: data.timeline || "Not specified",
          scope: safeScope || "Not specified",
          budget: data.budget || "Not specified",
          discovery: data.discovery || "Not specified",
          message: safeBrief,
        }),
      });

      const json = await response.json();
      if (json.success) {
        return res.status(200).json({
          success: true,
          message: "Brief received. We reply within two working days.",
        });
      }
      console.error("[Brief API] Web3Forms rejected the submission:", json);
    } catch (err) {
      console.error("[Brief API] Web3Forms error:", err);
    }
  }

  // 2. Resend — used when a verified sending domain is configured.
  if (resend) {
    try {
      const subject = `Brief from ${safeName}${safeOrg ? ` · ${safeOrg}` : ""}`;
      const body = [
        `Name: ${safeName}`,
        `Email: ${data.email}`,
        safeOrg ? `Organization: ${safeOrg}` : null,
        safeService ? `Service: ${safeService}` : null,
        data.timeline ? `Timeline: ${data.timeline}` : null,
        safeScope ? `Scope: ${safeScope}` : null,
        data.budget ? `Budget: ${data.budget}` : null,
        data.discovery ? `Discovery: ${data.discovery}` : null,
        ``,
        `---`,
        ``,
        safeBrief,
        ``,
        `---`,
        ``,
        `Submitted at: ${new Date().toISOString()}`,
        `Environment: ${ENV}`,
      ]
        .filter(Boolean)
        .join("\n");

      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: data.email,
        subject,
        text: body,
      });

      if (result.error) {
        console.error("[Brief API] Resend returned error:", result.error);
        return res.status(502).json({
          success: false,
          error: "Email provider rejected the message.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Brief received. We reply within two working days.",
        messageId: result.data?.id,
      });
    } catch (err) {
      console.error("[Brief API] Email send error:", err);
      return res.status(502).json({
        success: false,
        error: "Email delivery failed. Please email us directly.",
      });
    }
  }

  // No provider configured — surface it instead of pretending success.
  console.error("[Brief API] No delivery provider configured. Brief dropped:", {
    name: safeName,
    email: data.email,
    service: safeService,
  });

  return res.status(503).json({
    success: false,
    error:
      "Brief delivery is not configured on this deployment. Please email theofficetechies@gmail.com directly.",
  });
}
