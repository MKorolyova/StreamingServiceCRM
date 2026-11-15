import { z } from "zod";

export const uuidSchema = z
  .uuid("Invalid id");

export const isoDateSchema = z
  .iso
  .date("Must be a date in YYYY-MM-DD format");

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

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    query: z.string().trim().max(100).optional(),
    sortDir: z.enum(["asc", "desc"]).default("asc"),
    sortBy: z.string().trim().max(50).optional()
});