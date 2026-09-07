import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProduct } from "../src/data/products";

// Ensure a modern Node runtime with global fetch.
export const config = { runtime: "nodejs20.x" };

/**
 * POST /api/paystack
 *   { slug, email }  -> initialize a hosted Paystack checkout, return { url }.
 *   { reference }    -> verify a transaction, return its status.
 *
 * Fully wrapped so any failure returns a readable JSON error instead of an
 * unhandled crash (which Vercel reports as FUNCTION_INVOCATION_FAILED).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ configured: false, error: "Payments not configured." });

  try {
    // Body may arrive as an object (Vercel) or a JSON string.
    let body: Record<string, unknown> = {};
    if (typeof req.body === "string") {
      try {
        body = JSON.parse(req.body);
      } catch {
        body = {};
      }
    } else if (req.body && typeof req.body === "object") {
      body = req.body as Record<string, unknown>;
    }

    const origin = (req.headers.origin as string) || "https://www.the-office360.com";

    // ---- verify ----
    if (typeof body.reference === "string" && body.reference) {
      const resp = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.reference)}`,
        { headers: { Authorization: `Bearer ${secret}` } }
      );
      const json = await resp.json();
      return res.status(200).json({ configured: true, status: json?.data?.status, amount: json?.data?.amount });
    }

    // ---- initialize ----
    const slug = typeof body.slug === "string" ? body.slug : "";
    const email = typeof body.email === "string" ? body.email : "";
    const product = getProduct(slug);
    if (!product || !email) return res.status(400).json({ error: "Missing product or email." });

    const resp = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: Math.round(product.priceUsd * 100), // kobo
        callback_url: `${origin}/store`,
        metadata: { slug: product.slug, name: product.name.en },
      }),
    });
    const json = await resp.json();
    const url = json?.data?.authorization_url;
    if (!url) {
      return res.status(502).json({ configured: true, error: json?.message || "Paystack did not return a checkout URL." });
    }
    return res.status(200).json({ configured: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown payment error.";
    console.error("[paystack] handler error:", message);
    return res.status(500).json({ configured: true, error: message });
  }
}
