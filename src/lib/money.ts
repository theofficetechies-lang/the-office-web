/**
 * Money — one place for currency conversion and amount formatting.
 *
 * The catalogue prices in **USD** (`priceUsd`) and the store displays USD. The
 * only payment provider is Paystack, whose `amount` field is in the **minor
 * unit of the settlement currency** — for a Nigerian account that is kobo
 * (1 NGN = 100 kobo), not cents.
 *
 * The original implementation sent `priceUsd * 100` straight through, so a $950
 * product was charged ₦950 — about US$0.63 — and a $49 product ₦49. Nothing
 * errored; the payment simply went through at roughly 1/1500 of the intended
 * value. This module is the fix and the only place that conversion may happen.
 *
 * This file is shared by the browser and the serverless function, so it must not
 * import anything environment-specific.
 */

/** Settlement currency charged by Paystack. */
export const SETTLEMENT_CURRENCY = "NGN" as const;

/** Currency the catalogue is authored in. */
export const LIST_CURRENCY = "USD" as const;

/**
 * NGN per 1 USD.
 *
 * Deliberately a constant rather than a live lookup: an exchange-rate fetch in
 * the checkout path is a new network dependency and a new failure mode, and a
 * rate that silently drifts is worse than one that is reviewed. Override with
 * `NGN_PER_USD` in the server environment, and review it when it moves more
 * than a few percent.
 *
 * If you would rather avoid FX entirely, price the catalogue in NGN and set this
 * to 1 — `amountMinorUnits` then passes the price straight through.
 */
export const DEFAULT_NGN_PER_USD = 1550;

/** Guard rails: refuse to charge if the rate looks like a typo. */
const MIN_RATE = 100;
const MAX_RATE = 10_000;

export function ngnPerUsd(envValue?: string): number {
  const raw = typeof envValue === "string" ? envValue.trim() : "";
  if (!raw) return DEFAULT_NGN_PER_USD;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return DEFAULT_NGN_PER_USD;
  if (parsed < MIN_RATE || parsed > MAX_RATE) return DEFAULT_NGN_PER_USD;
  return parsed;
}

/**
 * Convert a USD catalogue price into the integer minor units Paystack expects.
 *
 * Throws rather than returning a wrong number: an unrepresentable price must
 * fail the request, not charge the customer something arbitrary.
 */
export function amountMinorUnits(priceUsd: number, rate = DEFAULT_NGN_PER_USD): number {
  if (!Number.isFinite(priceUsd) || priceUsd < 0) {
    throw new Error(`Invalid price: ${priceUsd}`);
  }
  if (!Number.isFinite(rate) || rate < MIN_RATE || rate > MAX_RATE) {
    throw new Error(`Refusing to charge with an implausible NGN/USD rate: ${rate}`);
  }
  const minor = Math.round(priceUsd * rate * 100);
  if (!Number.isSafeInteger(minor) || minor <= 0) {
    throw new Error(`Amount is not chargeable: ${priceUsd} USD → ${minor} minor units`);
  }
  return minor;
}

/** "₦76,450" — the price the customer will actually be charged. */
export function formatNgn(minorUnits: number): string {
  const major = minorUnits / 100;
  return `₦${major.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** "US$49" — the catalogue price. */
export function formatUsd(priceUsd: number): string {
  return `US$${priceUsd.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * The customer-facing charge line, e.g.
 *   "US$49 — charged as ₦75,950"
 *
 * Shown at checkout so nobody is surprised by the settlement currency. This is
 * the transparency the original store lacked: it advertised "$49" and charged
 * in naira with no conversion and no explanation.
 */
export function chargeSummary(priceUsd: number, rate = DEFAULT_NGN_PER_USD): string {
  const usd = formatUsd(priceUsd);
  try {
    const minor = amountMinorUnits(priceUsd, rate);
    return `${usd} — charged as ${formatNgn(minor)}`;
  } catch {
    return `${usd} — contact us for a quote`;
  }
}
