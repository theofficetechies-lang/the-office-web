import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { rateLimit } from "./_lib/rate-limit.js";
import { briefSchema, sanitizeText } from "./_lib/validate.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.TO_EMAIL ?? "hello@theoffice.studio";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
const ENV = process.env.VERCEL_ENV ?? "development";

const CORS_ORIGIN =
  ENV === "production"
    ? "https://theoffice.studio"
    : ENV === "preview"
      ? "*"
      : "http://localhost:5173";

function setCors(res: VercelResponse, origin: string) {
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
  setCors(res, CORS_ORIGIN);
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
      message: "Received",
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

  // Do not send emails in development unless explicitly enabled
  if (ENV === "development" && !process.env.ENABLE_DEV_EMAIL) {
    // eslint-disable-next-line no-console
    console.log("[DEV] Brief received:", {
      name: safeName,
      email: data.email,
      org: safeOrg,
      service: data.service,
      briefPreview: safeBrief.slice(0, 200),
    });
    return res.status(200).json({
      success: true,
      message: "Brief received (dev mode — email not sent)",
    });
  }

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
      throw new Error(result.error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Brief received. We reply within two working days.",
      messageId: result.data?.id,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[Brief API] Email send failed:", err);
    return res.status(502).json({
      success: false,
      error: "Unable to deliver your brief. Please email us directly at hello@theoffice.studio",
    });
  }
}
