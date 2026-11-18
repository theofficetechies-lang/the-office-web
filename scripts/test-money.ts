/**
 * Money conversion tests — the Paystack currency bug guard.
 *
 * A $950 product was charged ₦950 because `priceUsd * 100` was passed straight
 * to an API whose amount is in kobo. Nothing threw, no test failed, and the
 * loss was silent. These assertions exist so that cannot happen again.
 *
 *   npm run test:money
 */
import {
  amountMinorUnits,
  ngnPerUsd,
  formatNgn,
  formatUsd,
  chargeSummary,
  DEFAULT_NGN_PER_USD,
} from "../src/lib/money.ts";

let failures = 0;
function check(label: string, ok: boolean, detail = "") {
  if (ok) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log(`Money conversion (rate: ${DEFAULT_NGN_PER_USD} NGN/USD)\n`);

// --- The bug that motivated this file -------------------------------------
{
  const charged = amountMinorUnits(950);
  check(
    "US$950 is charged as ₦1,472,500, not ₦950",
    charged === 950 * DEFAULT_NGN_PER_USD * 100,
    `got ${charged} minor units`
  );
  check(
    "the charged amount is in the thousands, not the hundreds",
    charged > 1_000_000,
    `got ${charged}`
  );
  check("US$49 charges ₦75,950", amountMinorUnits(49) === 49 * 1550 * 100);
  check("US$29 charges ₦44,950", amountMinorUnits(29) === 29 * 1550 * 100);
}

// --- Integer minor units ---------------------------------------------------
{
  check("result is always an integer", Number.isInteger(amountMinorUnits(49)));
  check("result is a safe integer", Number.isSafeInteger(amountMinorUnits(950)));
  check("fractional USD rounds to whole kobo", Number.isInteger(amountMinorUnits(0.015)));
}

// --- Refusals rather than wrong amounts ------------------------------------
{
  const throws = (fn: () => unknown) => {
    try {
      fn();
      return false;
    } catch {
      return true;
    }
  };
  check("negative price throws", throws(() => amountMinorUnits(-1)));
  check("NaN price throws", throws(() => amountMinorUnits(NaN)));
  check("Infinity price throws", throws(() => amountMinorUnits(Infinity)));
  check("zero price throws (unpurchasable)", throws(() => amountMinorUnits(0)));
  check("absurdly low rate throws", throws(() => amountMinorUnits(49, 1)));
  check("absurdly high rate throws", throws(() => amountMinorUnits(49, 1_000_000)));
}

// --- Rate parsing ----------------------------------------------------------
{
  check("blank env falls back to the default", ngnPerUsd("") === DEFAULT_NGN_PER_USD);
  check("undefined env falls back", ngnPerUsd(undefined) === DEFAULT_NGN_PER_USD);
  check("junk env falls back", ngnPerUsd("not-a-number") === DEFAULT_NGN_PER_USD);
  check("a typo rate falls back", ngnPerUsd("15") === DEFAULT_NGN_PER_USD);
  check("a sane override is honoured", ngnPerUsd("1700") === 1700);
  check("whitespace is tolerated", ngnPerUsd("  1600  ") === 1600);
}

// --- Formatting ------------------------------------------------------------
{
  check("NGN formats with the naira sign", formatNgn(950 * 1550 * 100).startsWith("₦"));
  check(
    "US$49 charges ₦75,950 (formatted)",
    formatNgn(amountMinorUnits(49)) === "₦75,950",
    formatNgn(amountMinorUnits(49))
  );
  check("USD formats as US$", formatUsd(49) === "US$49", formatUsd(49));
  check(
    "charge summary states both currencies",
    chargeSummary(49) === `US$49 — charged as ₦75,950`,
    chargeSummary(49)
  );
}

// --- The naira price must never be less than the dollar price --------------
{
  const ok = [29, 49, 950, 2500].every((usd) => amountMinorUnits(usd) / 100 > usd * 100);
  check("naira charge always exceeds the USD figure by >100×", ok);
}

if (failures > 0) {
  console.error(`\n${failures} money check(s) failed.`);
  process.exit(1);
}
console.log("\nAll money checks passed.");
