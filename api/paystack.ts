import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Raw Node response helper — Vercel's res has no .status/.json. */
function send(res: VercelResponse, code: number, obj: unknown) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

/**
 * POST /api/paystack
 *   { slug, email }  -> initialize a hosted Paystack checkout, return { url }.
 *   { reference }    -> verify a transaction, return its status.
 * GET /api/paystack  -> diagnostics.
 *
 * Uses only the raw Node response API (statusCode/setHeader/end) so it cannot
 * crash on Vercel. Catalog is imported lazily; all failures return JSON.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return send(res, 200, {
      ok: true,
      node: process.version,
      hasFetch: typeof fetch === "function",
      hasSecret: Boolean(process.env.PAYSTACK_SECRET_KEY),
    });
  }

  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return send(res, 503, { configured: false, error: "Payments not configured." });

  try {
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

    if (typeof body.reference === "string" && body.reference) {
      const resp = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.reference)}`,
        { headers: { Authorization: `Bearer ${secret}` } }
      );
      const json = await resp.json();
      return send(res, 200, { configured: true, status: json?.data?.status, amount: json?.data?.amount });
    }

    const slug = typeof body.slug === "string" ? body.slug : "";
    const email = typeof body.email === "string" ? body.email : "";
    const { getProduct } = await import("../src/data/products");
    const product = getProduct(slug);
    if (!product || !email) return send(res, 400, { error: "Missing product or email." });

    const resp = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: Math.round(product.priceUsd * 100),
        callback_url: `${origin}/store`,
        metadata: { slug: product.slug, name: product.name.en },
      }),
    });
    const json = await resp.json();
    const url = json?.data?.authorization_url;
    if (!url) return send(res, 502, { configured: true, error: json?.message || "No checkout URL." });
    return send(res, 200, { configured: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown payment error.";
    console.error("[paystack] handler error:", message);
    return send(res, 500, { configured: true, error: message });
  }
}
