import { z } from "zod";
import {
  countryCodeSchema,
  currencyCodeSchema,
  paginationSchema,
  uuidSchema,
} from "./common";

export const countryKeySchema = z.object({
  countryCode: countryCodeSchema,
});

export const createCountrySchema = z.object({
  countryCode: countryCodeSchema,
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  currencyCode: currencyCodeSchema,
});

export const updateCountrySchema = createCountrySchema
  .omit({ countryCode: true})
  .partial();

export const paginationCountriesSchema = paginationSchema.extend({
  sortBy: z.enum(["name", "subscribers", "active", "revenue", "watchTime", "plan"]).default("subscribers"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  plan: uuidSchema.optional().catch(undefined),
});
