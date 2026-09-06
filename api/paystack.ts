import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getProduct } from "../src/data/products";

/**
 * POST /api/paystack
 *   { slug, email }  -> initialize a hosted Paystack checkout and return
 *                       { url } (a full-page redirect; no pop-ups).
 *   { reference }    -> verify a transaction server-side and return its status.
 *
 * Uses the hosted standard flow (transaction/initialize) so it works on any
 * domain and is not blocked by pop-up blockers or inline-script issues.
 * Requires PAYSTACK_SECRET_KEY (Vercel env). Without it: 503 {configured:false}.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ configured: false, error: "Payments not configured." });

  const body = req.body ?? {};
  const origin = (req.headers.origin as string) || "https://the-office-test4.vercel.app";

  // ---- verify ----
  if (typeof body.reference === "string" && body.reference) {
    try {
      const resp = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.reference)}`,
        { headers: { Authorization: `Bearer ${secret}` } }
      );
      const json = await resp.json();
      return res.status(200).json({ configured: true, status: json?.data?.status, amount: json?.data?.amount });
    } catch (err) {
      console.error("[paystack] verify error:", err);
      return res.status(502).json({ error: "Could not verify payment." });
    }
  }

  // ---- initialize ----
  const slug = typeof body.slug === "string" ? body.slug : "";
  const email = typeof body.email === "string" ? body.email : "";
  const product = getProduct(slug);
  if (!product || !email) return res.status(400).json({ error: "Missing product or email." });

  try {
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
    if (!url) return res.status(502).json({ error: json?.message || "Paystack did not return a checkout URL." });
    return res.status(200).json({ configured: true, url });
  } catch (err) {
    console.error("[paystack] initialize error:", err);
    return res.status(502).json({ error: "Could not start checkout." });
  }
}
