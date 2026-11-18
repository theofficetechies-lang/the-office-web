import { z } from "zod";

/**
 * Whitespace-only input must not pass a length check.
 *
 * Zod runs `.min()` before `.transform()`, so the original
 * `z.string().min(1).transform((s) => s.trim())` accepted "   " — a submission of
 * pure spaces arrived as an empty email and was acknowledged as a success.
 * `.trim()` is itself a transform and transforms run in declaration order, so
 * trimming *first* is what makes the length and format checks honest.
 */
const trimmedString = () => z.string().trim();

/** Optional free-text field: trimmed first, then length-checked, empty allowed. */
const optionalText = (max: number, message?: string) =>
  trimmedString()
    .max(max, message)
    .optional()
    .or(z.literal(""));

export const briefSchema = z.object({
  name: trimmedString()
    .max(100, "Name must be under 100 characters")
    .min(1, "Name is required"),

  email: trimmedString()
    .max(254, "Email is too long")
    .email("Please provide a valid email")
    .min(1, "Email is required")
    .transform((s) => s.toLowerCase()),

  org: optionalText(200, "Organization name is too long"),

  /** Comma-separated list of service labels chosen in the form. */
  service: optionalText(200, "Service selection is too long"),

  timeline: optionalText(80, "Timeline is too long"),

  scope: optionalText(120, "Scope is too long"),

  budget: optionalText(50, "Budget is too long"),

  discovery: optionalText(100, "Discovery source is too long"),

  brief: trimmedString()
    .max(5000, "Brief must be under 5000 characters")
    .min(3, "Brief must be at least 3 characters"),

  /** Honeypot — must stay empty. */
  company_website: optionalText(100, "Field is too long"),
});

export type BriefInput = z.infer<typeof briefSchema>;

/**
 * Basic XSS sanitization: strip HTML tags and normalize whitespace.
 * This is a defense-in-depth measure; React also escapes output on the frontend.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\r\n]+/g, "\n")
    .trim();
}
