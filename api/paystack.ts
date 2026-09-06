import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * POST /api/paystack  { reference }
 *
 * Server-side verification of a Paystack transaction. Never trust the client's
 * "onSuccess" alone — confirm the payment actually succeeded and for the right
 * amount before treating an order as paid.
 *
 * Requires PAYSTACK_SECRET_KEY. Without it returns 503 {configured:false}.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ configured: false, error: "Payments not configured." });

  const reference = typeof req.body?.reference === "string" ? req.body.reference : "";
  if (!reference) return res.status(400).json({ error: "Missing reference." });

  try {
    const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const json = await resp.json();
    const status = json?.data?.status;
    const amount = json?.data?.amount;
    return res.status(200).json({ configured: true, status, amount });
  } catch (err) {
    console.error("[paystack] verify error:", err);
    return res.status(502).json({ error: "Could not verify payment." });
  }
}
