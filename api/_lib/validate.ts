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
    .transform((s) => s.trim())
    .optional(),
  service: z
    .string()
    .max(50)
    .transform((s) => s.trim())
    .optional(),
  brief: z
    .string()
    .min(20, "Brief must be at least 20 characters")
    .max(5000, "Brief must be under 5000 characters")
    .transform((s) => s.trim()),
  company_website: z
    .string()
    .max(100)
    .optional()
    .transform((s) => s?.trim()),
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
