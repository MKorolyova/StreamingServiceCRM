import { z } from "zod";
import {
  countryCodeSchema,
  currencyCodeSchema,
  listQuerySchema,
  requireAtLeastOneField,
} from "./common";

export const countryKeySchema = z.object({ countryCode: countryCodeSchema });

export const createCountrySchema = z.object({
  countryCode: countryCodeSchema,
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  currencyCode: currencyCodeSchema,
});

export const updateCountrySchema = requireAtLeastOneField(
  createCountrySchema.omit({ countryCode: true }).partial(),
);

export const listCountriesQuerySchema = listQuerySchema(["countryCode", "name", "currencyCode"]);
