import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { rateLimit } from "./_lib/rate-limit.js";
import { briefSchema, sanitizeText } from "./_lib/validate.js";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const web3FormsKey = process.env.WEB3FORMS_KEY || process.env.WEB3FORMS_ACCESS_KEY;
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

  // 1. If Web3Forms Access Key is provided, use it (No domain required, delivers to any inbox)
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
          from_name: "THE OFFICE Studio",
          name: safeName,
          email: data.email,
          organization: safeOrg || "None",
          service: data.service || "General Inquiry",
          timeline: data.timeline || "Not specified",
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
    } catch (err) {
      console.error("[Brief API] Web3Forms error:", err);
    }
  }

  // 2. If Resend is available and API key configured, send real email
  if (resend) {
    try {
      const subject = `Brief from ${safeName}${safeOrg ? ` · ${safeOrg}` : ""}`;
      const body = [
        `Name: ${safeName}`,
        `Email: ${data.email}`,
        safeOrg ? `Organization: ${safeOrg}` : null,
        data.service ? `Service: ${data.service}` : null,
        data.timeline ? `Timeline: ${data.timeline}` : null,
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

  // Fallback (e.g. dev/preview or when keys not yet set)
  console.log("[Brief Received]:", {
    name: safeName,
    email: data.email,
    org: safeOrg,
    service: data.service,
    timeline: data.timeline,
    budget: data.budget,
    discovery: data.discovery,
    briefPreview: safeBrief.slice(0, 200),
  });

  return res.status(200).json({
    success: true,
    message: "Brief received. We reply within two working days.",
  });
}
