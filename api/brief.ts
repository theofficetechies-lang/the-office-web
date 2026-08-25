import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { rateLimit } from "./_lib/rate-limit.js";
import { briefSchema, sanitizeText } from "./_lib/validate.js";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const TO_EMAIL = process.env.TO_EMAIL ?? "theofficetechies@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
const ENV = process.env.VERCEL_ENV ?? "development";

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function setSecurityHeaders(res: VercelResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'"
  );
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCors(req, res);
  setSecurityHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
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
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      issues,
    });
  }

  const data = parse.data;

  // Sanitize
  const safeName = sanitizeText(data.name);
  const safeOrg = data.org ? sanitizeText(data.org) : undefined;
  const safeBrief = sanitizeText(data.brief);

  // If Resend is available and API key configured, send real email
  if (resend) {
    try {
      const subject = `Brief from ${safeName}${safeOrg ? ` · ${safeOrg}` : ""}`;
      const body = [
        `Name: ${safeName}`,
        `Email: ${data.email}`,
        safeOrg ? `Organization: ${safeOrg}` : null,
        data.service ? `Service: ${data.service}` : null,
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
      }

      return res.status(200).json({
        success: true,
        message: "Brief received. We reply within two working days.",
        messageId: result.data?.id,
      });
    } catch (err) {
      console.error("[Brief API] Email send error:", err);
      return res.status(200).json({
        success: true,
        message: "Brief received. We reply within two working days.",
      });
    }
  }

  // Resend API key not configured (e.g. initial setup / development / preview)
  console.log("[Brief Received - Resend API key not configured]:", {
    name: safeName,
    email: data.email,
    org: safeOrg,
    service: data.service,
    briefPreview: safeBrief.slice(0, 200),
  });

  return res.status(200).json({
    success: true,
    message: "Brief received. We reply within two working days.",
  });
}
