import type { z } from "zod";
import type { countries } from "@/db/schema";
import type {
  countryKeySchema,
  createCountrySchema,
  paginationCountriesSchema,
  updateCountrySchema,
} from "@/validators/countries";

export type Country = typeof countries.$inferSelect;
export type CountryKey = z.infer<typeof countryKeySchema>;
export type CreateCountryInput = z.infer<typeof createCountrySchema>;
export type UpdateCountryInput = z.infer<typeof updateCountrySchema>;
export type ListCountriesQuery = z.infer<typeof paginationCountriesSchema>;
