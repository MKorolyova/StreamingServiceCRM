import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const uuidSchema = z.uuid("Invalid id");

// `date` columns use Drizzle's string mode: "YYYY-MM-DD".
export const isoDateSchema = z.iso.date("Must be a date in YYYY-MM-DD format");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email address").max(255, "Email is too long"));

export const countryCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/, "Must be a 2-letter ISO 3166-1 country code");

export const currencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Must be a 3-letter ISO 4217 currency code");

// ---------------------------------------------------------------------------
// Refinement helpers
// ---------------------------------------------------------------------------

export function requireAtLeastOneField<T extends z.ZodObject>(schema: T) {
  return schema.refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
  });
}

// ---------------------------------------------------------------------------
// List / pagination query (parsed from URL search params)
// ---------------------------------------------------------------------------

export function listQuerySchema<const T extends readonly [string, ...string[]]>(sortFields: T) {
  return z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().max(100).optional(),
    sortBy: z.enum(sortFields).optional(),
    sortDir: z.enum(["asc", "desc"]).default("asc"),
  });
}

export const dateRangeQuerySchema = z
  .object({
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
  })
  .refine((range) => !range.from || !range.to || range.to >= range.from, {
    message: "`to` must be on or after `from`",
    path: ["to"],
  });
