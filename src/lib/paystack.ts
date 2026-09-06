/**
 * Paystack checkout (client). Paystack is a Nigerian payments company that
 * accepts local cards, bank transfer and USSD as well as international
 * Visa/Mastercard — i.e. it covers Nigeria and global payments.
 *
 * Requires VITE_PAYSTACK_PUBLIC_KEY. Without it, returns {configured:false}
 * and the store shows "payments being set up".
 */
export function genReference(): string {
  return "TO360-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

export interface PayArgs {
  email: string;
  amountKobo: number;
  reference: string;
  onSuccess: (ref: string) => void;
  onCancel: () => void;
}

export async function payWithPaystack({
  email,
  amountKobo,
  reference,
  onSuccess,
  onCancel,
}: PayArgs): Promise<{ configured: boolean }> {
  const key = (import.meta as { env?: Record<string, string> }).env?.VITE_PAYSTACK_PUBLIC_KEY;
  if (!key) return { configured: false };

  const { default: Paystack } = await import("@paystack/inline-js");
  const pop = new Paystack(key);
  pop.newTransaction({
    reference,
    email,
    amount: amountKobo,
    onSuccess: () => onSuccess(reference),
    onCancel: () => onCancel(),
  });
  return { configured: true };
}
