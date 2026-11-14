import type { z } from "zod";
import type { genres, movieCertifications, movieGenres, movies } from "@/db/schema";
import type {
  createGenreSchema,
  createMovieCertificationSchema,
  createMovieSchema,
  genreKeySchema,
  listGenresQuerySchema,
  listMoviesQuerySchema,
  maturityLevelSchema,
  movieCertificationKeySchema,
  movieGenreKeySchema,
  movieKeySchema,
  setMovieGenresSchema,
  updateGenreSchema,
  updateMovieCertificationSchema,
  updateMovieSchema,
} from "@/validators/catalog";

export type MaturityLevel = z.infer<typeof maturityLevelSchema>;

export type Movie = typeof movies.$inferSelect;
export type MovieKey = z.infer<typeof movieKeySchema>;
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type ListMoviesQuery = z.infer<typeof listMoviesQuerySchema>;

export type Genre = typeof genres.$inferSelect;
export type GenreKey = z.infer<typeof genreKeySchema>;
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
export type ListGenresQuery = z.infer<typeof listGenresQuerySchema>;

export type MovieGenre = typeof movieGenres.$inferSelect;
export type MovieGenreKey = z.infer<typeof movieGenreKeySchema>;
export type SetMovieGenresInput = z.infer<typeof setMovieGenresSchema>;

export type MovieCertification = typeof movieCertifications.$inferSelect;
export type MovieCertificationKey = z.infer<typeof movieCertificationKeySchema>;
export type CreateMovieCertificationInput = z.infer<typeof createMovieCertificationSchema>;
export type UpdateMovieCertificationInput = z.infer<typeof updateMovieCertificationSchema>;
