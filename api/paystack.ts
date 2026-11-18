import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProduct } from "../src/data/products";
import {
  amountMinorUnits,
  ngnPerUsd,
  SETTLEMENT_CURRENCY,
  formatNgn,
} from "../src/lib/money";

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
      currency: SETTLEMENT_CURRENCY,
      ngnPerUsd: ngnPerUsd(process.env.NGN_PER_USD),
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
    const product = getProduct(slug);
    if (!product || !email) return send(res, 400, { error: "Missing product or email." });

    /**
     * Paystack's `amount` is in the minor unit of the settlement currency
     * (kobo for NGN) — NOT US cents. Sending `priceUsd * 100` charged ₦950 for a
     * US$950 product. amountMinorUnits() performs the conversion and refuses to
     * return an implausible figure.
     */
    const rate = ngnPerUsd(process.env.NGN_PER_USD);
    let amount: number;
    try {
      amount = amountMinorUnits(product.priceUsd, rate);
    } catch (err) {
      console.error("[paystack] refusing to charge:", err);
      return send(res, 500, {
        configured: true,
        error: "This product is not currently purchasable online. Please email us.",
      });
    }

    const resp = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount,
        currency: SETTLEMENT_CURRENCY,
        callback_url: `${origin}/store`,
        metadata: {
          slug: product.slug,
          name: product.name.en,
          list_currency: "USD",
          list_price: product.priceUsd,
          ngn_per_usd: rate,
        },
      }),
    });
    const json = await resp.json();
    const url = json?.data?.authorization_url;
    if (!url) return send(res, 502, { configured: true, error: json?.message || "No checkout URL." });
    return send(res, 200, {
      configured: true,
      url,
      amount,
      currency: SETTLEMENT_CURRENCY,
      display: formatNgn(amount),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown payment error.";
    console.error("[paystack] handler error:", message);
    return send(res, 500, { configured: true, error: message });
  }
}
