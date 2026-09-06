/**
 * Paystack helpers (client).
 *
 * Checkout itself is done via the hosted redirect flow in api/paystack.ts
 * (no pop-ups, works on any domain). This module only exposes the key mode for
 * the TEST/LIVE badge.
 */
export function paystackMode(): "live" | "test" | null {
  const key = (import.meta as { env?: Record<string, string> }).env?.VITE_PAYSTACK_PUBLIC_KEY;
  if (!key) return null;
  return key.startsWith("pk_live_") ? "live" : "test";
}

/**
 * Kick off a hosted Paystack checkout through our server and redirect to it.
 * Resolves true if a redirect was started; false if payments are unconfigured.
 */
export async function startCheckout(slug: string, email: string): Promise<boolean> {
  const res = await fetch("/api/paystack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, email }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok && data.url) {
    window.location.href = data.url;
    return true;
  }
  return data.configured !== false; // false => unconfigured; true => other error
}

/** Verify a returned reference after Paystack redirects back. */
export async function verifyReference(reference: string): Promise<string | null> {
  try {
    const res = await fetch("/api/paystack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });
    const data = await res.json().catch(() => ({}));
    return data.status ?? null;
  } catch {
    return null;
  }
}
