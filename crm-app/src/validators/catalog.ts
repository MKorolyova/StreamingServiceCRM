import { z } from "zod";
import { maturityLevelEnum } from "@/db/schema";
import { countryCodeSchema, listQuerySchema, requireAtLeastOneField, uuidSchema } from "./common";

export const maturityLevelSchema = z.enum(maturityLevelEnum.enumValues, "Invalid maturity rating");

// ---------------------------------------------------------------------------
// Movies
// ---------------------------------------------------------------------------

const FIRST_FILM_YEAR = 1888;
const MAX_RELEASE_YEAR = new Date().getFullYear() + 5;

export const movieKeySchema = z.object({ movieId: uuidSchema });

export const createMovieSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long"),
  releaseYear: z.number("Release year must be a number").int("Release year must be a whole number").min(FIRST_FILM_YEAR, `Release year must be ${FIRST_FILM_YEAR} or later`).max(MAX_RELEASE_YEAR, `Release year must be ${MAX_RELEASE_YEAR} or earlier`),
  runtimeMinutes: z.number("Runtime must be a number").int("Runtime must be a whole number").min(1, "Runtime must be at least 1 minute").max(32_767, "Runtime is too long"),
  maturityRating: maturityLevelSchema,
});

export const updateMovieSchema = requireAtLeastOneField(createMovieSchema.partial());

export const listMoviesQuerySchema = listQuerySchema([
  "title",
  "releaseYear",
  "runtimeMinutes",
  "maturityRating",
]).extend({
  maturityRating: maturityLevelSchema.optional(),
  genreId: uuidSchema.optional(),
  releaseYear: z.coerce.number().int().min(FIRST_FILM_YEAR).max(MAX_RELEASE_YEAR).optional(),
});

// ---------------------------------------------------------------------------
// Genres
// ---------------------------------------------------------------------------

export const genreKeySchema = z.object({ genreId: uuidSchema });

export const createGenreSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name is too long"),
});

export const updateGenreSchema = createGenreSchema;

export const listGenresQuerySchema = listQuerySchema(["name"]);

// ---------------------------------------------------------------------------
// Movie <-> Genre
// ---------------------------------------------------------------------------

export const movieGenreKeySchema = z.object({
  movieId: uuidSchema,
  genreId: uuidSchema,
});

// Replaces the full genre set of a movie.
export const setMovieGenresSchema = z.object({
  movieId: uuidSchema,
  genreIds: z.array(uuidSchema).max(20, "A movie can have at most 20 genres"),
})
  .refine((movie) => new Set(movie.genreIds).size === movie.genreIds.length, { message: "Genres must be unique", path: ["genreIds"] });

// ---------------------------------------------------------------------------
// Movie certifications (per country)
// ---------------------------------------------------------------------------

const certificationSchema = z.string().trim().min(1, "Certification is required").max(10, "Certification is too long");

export const movieCertificationKeySchema = z.object({
  movieId: uuidSchema,
  countryCode: countryCodeSchema,
});

export const createMovieCertificationSchema = movieCertificationKeySchema.extend({
  certification: certificationSchema,
});

export const updateMovieCertificationSchema = z.object({
  certification: certificationSchema,
});
