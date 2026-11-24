import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { rateLimit } from "./_lib/rate-limit.js";
import { send, noContent } from "./_lib/respond.js";
import { briefSchema, sanitizeText } from "./_lib/validate.js";
import { resolveLeadStore, persistLead, toLeadRow } from "./_lib/leads.js";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
/*
 * Read per request, not once at module load.
 *
 * A top-level `const` freezes the value at import, which made the suite unable to
 * exercise the delivery path at all: tests that set WEB3FORMS_KEY after import were
 * silently testing the "no provider" branch and passing for the wrong reason. It
 * also means a key added in the Vercel dashboard takes effect without needing a
 * cold start to pick it up.
 */
const web3FormsKeyNow = () =>
  process.env.WEB3FORMS_KEY || process.env.WEB3FORMS_ACCESS_KEY || "";
const TO_EMAIL = process.env.TO_EMAIL ?? "theofficetechies@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
const ENV = process.env.VERCEL_ENV ?? "development";

/**
 * CORS allowlist. Set CORS_ORIGIN to a comma-separated list of production
 * origins; Vercel preview deployments (*.vercel.app) and local development are
 * permitted so previews and `vercel dev` work without extra configuration.
 */
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "https://www.the-office360.com")
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
    return noContent(res);
  }

  if (req.method !== "POST") {
    return send(res, 405, { success: false, error: "Method not allowed" });
  }

  const origin = req.headers.origin as string | undefined;
  if (origin && !originAllowed(origin)) {
    return send(res, 403, { success: false, error: "Origin not allowed" });
  }

  // Rate limiting
  const limit = rateLimit(req);
  res.setHeader("X-RateLimit-Limit", String(limit.limit));
  res.setHeader("X-RateLimit-Remaining", String(limit.remaining));
  res.setHeader("X-RateLimit-Reset", String(limit.reset));

  if (!limit.success) {
    return send(res, 429, {
      success: false,
      error: "Too many requests. Please try again in 15 minutes.",
    });
  }

  // Honeypot check
  const rawBody = req.body ?? {};
  if (rawBody.company_website && String(rawBody.company_website).trim().length > 0) {
    // Silently accept so bots don't retry
    return send(res, 200, {
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
    return send(res, 400, { success: false, error: "Validation failed", issues });
  }

  const data = parse.data;

  /*
   * Persist first, deliver second.
   *
   * A stored lead is the durable record; an email is a notification about it. Doing
   * this in the other order means a provider outage loses the enquiry entirely,
   * which is exactly how leads were being lost before this existed. The result is
   * kept so the response can tell the truth about what happened to the row.
   *
   * `source` records the pathway the visitor used, so attribution survives even if
   * the email is never read.
   */
  const store = resolveLeadStore();
  const sourceHeader = req.headers["x-lead-source"];
  const lead = toLeadRow(data, typeof sourceHeader === "string" ? sourceHeader : "brief-form");
  const persistence = await persistLead(store, lead);

  if (persistence.status === "failed") {
    console.error("[Brief API] Lead persistence failed:", persistence.reason);
  }

  const storedNote =
    persistence.status === "stored" ? { stored: true, leadId: persistence.id } :
    persistence.status === "not_configured" ? { stored: false } :
    { stored: false };

  // Sanitize
  const safeName = sanitizeText(data.name);
  const safeOrg = data.org ? sanitizeText(data.org) : undefined;
  const safeBrief = sanitizeText(data.brief);
  const safeService = data.service ? sanitizeText(data.service) : "";
  const safeScope = data.scope ? sanitizeText(data.scope) : "";

  // 1. Web3Forms — delivers straight to the inbox without a verified domain.
  if (web3FormsKeyNow()) {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKeyNow(),
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
          interest: data.interest || "",
          message: safeBrief,
        }),
      });

      const json = await response.json();
      if (json.success) {
        return send(res, 200, {
          success: true,
          message: "Brief received. We reply within two working days.",
          ...storedNote,
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
        data.interest ? `Interest: ${data.interest}` : null,
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
        /*
         * If the row is already in the database the enquiry is safe: it is not lost,
         * only the notification failed, and telling the visitor "that failed" would
         * make them send it again. Report a success they can trust and log the
         * delivery failure for us to act on.
         */
        if (persistence.status === "stored") {
          return send(res, 200, {
            success: true,
            message: "Brief received. We reply within two working days.",
            ...storedNote,
          });
        }
        return send(res, 502, {
          success: false,
          error: "Email provider rejected the message.",
        });
      }

      return send(res, 200, {
        success: true,
        message: "Brief received. We reply within two working days.",
        messageId: result.data?.id,
        ...storedNote,
      });
    } catch (err) {
      console.error("[Brief API] Email send error:", err);
      return send(res, 502, {
        success: false,
        error: "Email delivery failed. Please email us directly.",
      });
    }
  }

  /*
   * No delivery provider configured.
   *
   * With a database the brief is not dropped at all — it is stored and will appear
   * in the admin list, so the honest answer is "received", plus a smaller caveat
   * that the notification email did not go out. Without a database, nothing has
   * been kept, and saying "received" would be a lie: the visitor is told to email
   * directly.
   */
  if (persistence.status === "stored") {
    console.warn("[Brief API] No delivery provider configured; lead stored only.", {
      leadId: persistence.id,
      interest: data.interest || "",
    });
    return send(res, 200, {
      success: true,
      message:
        "Brief received. Your details are saved and we reply within two working days.",
      ...storedNote,
    });
  }

  console.error("[Brief API] No delivery provider configured. Brief dropped:", {
    name: safeName,
    email: data.email,
    service: safeService,
    interest: data.interest || "",
  });

  return send(res, 503, {
    success: false,
    error:
      "Brief delivery is not configured on this deployment. Please email theofficetechies@gmail.com directly.",
  });
}
