import { z } from "zod";

export const briefSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters")
    .transform((s) => s.trim()),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email")
    .max(254, "Email is too long")
    .transform((s) => s.trim().toLowerCase()),
  org: z
    .string()
    .max(200, "Organization name is too long")
    .optional()
    .or(z.literal(""))
    .transform((s) => (s ? s.trim() : "")),
  /** Comma-separated list of service labels chosen in the form. */
  service: z
    .string()
    .max(200, "Service selection is too long")
    .optional()
    .or(z.literal(""))
    .transform((s) => (s ? s.trim() : "")),
  timeline: z
    .string()
    .max(80)
    .optional()
    .or(z.literal(""))
    .transform((s) => (s ? s.trim() : "")),
  scope: z
    .string()
    .max(120)
    .optional()
    .or(z.literal(""))
    .transform((s) => (s ? s.trim() : "")),
  budget: z
    .string()
    .max(50)
    .optional()
    .or(z.literal(""))
    .transform((s) => (s ? s.trim() : "")),
  discovery: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((s) => (s ? s.trim() : "")),
  brief: z
    .string()
    .min(3, "Brief must be at least 3 characters")
    .max(5000, "Brief must be under 5000 characters")
    .transform((s) => s.trim()),
  company_website: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((s) => (s ? s.trim() : "")),
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
