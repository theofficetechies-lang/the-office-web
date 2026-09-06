import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getProduct } from "../src/data/products";

/**
 * POST /api/checkout  { slug }
 *
 * Creates a Stripe Checkout session for a catalog product using ad-hoc
 * `price_data`, so no Stripe Price objects need to pre-exist. Card data never
 * touches us — Stripe hosts the payment page.
 *
 * Until STRIPE_SECRET_KEY is configured this returns 503 { configured:false },
 * and the store shows "payments coming soon" instead of a broken button.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(503).json({ configured: false, error: "Payments are not configured yet." });
  }

  const slug = typeof req.body?.slug === "string" ? req.body.slug : "";
  const product = getProduct(slug);
  if (!product) {
    return res.status(404).json({ error: "Unknown product." });
  }

  const origin = (req.headers.origin as string) || "https://the-office-test4.vercel.app";
  const stripe = new Stripe(key);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(product.priceUsd * 100),
            product_data: { name: product.name.en },
          },
        },
      ],
      metadata: { slug: product.slug, kind: product.kind },
      success_url: `${origin}/store?status=success&item=${encodeURIComponent(product.slug)}`,
      cancel_url: `${origin}/store?status=cancelled`,
    });

    return res.status(200).json({ configured: true, url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return res.status(502).json({ error: "Could not start checkout." });
  }
}
