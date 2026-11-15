import type { z } from "zod";
import type { genres, maturityLevelEnum, movieCertifications, movieGenres, movies } from "@/db/schema";
import type {
  createGenreSchema,
  createMovieCertificationSchema,
  createMovieGenresSchema,
  createMovieSchema,
  genreKeySchema,
  movieCertificationKeySchema,
  movieGenreKeySchema,
  movieKeySchema,
  paginationMoviesQuerySchema,
  updateGenreSchema,
  updateMovieCertificationSchema,
  updateMovieSchema,
} from "@/validators/catalog";

export type MaturityLevel = (typeof maturityLevelEnum.enumValues)[number];

export type Movie = typeof movies.$inferSelect;
export type MovieKey = z.infer<typeof movieKeySchema>;
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type ListMoviesQuery = z.infer<typeof paginationMoviesQuerySchema>;

export type Genre = typeof genres.$inferSelect;
export type GenreKey = z.infer<typeof genreKeySchema>;
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;

export type MovieGenre = typeof movieGenres.$inferSelect;
export type MovieGenreKey = z.infer<typeof movieGenreKeySchema>;
export type CreateMovieGenresInput = z.infer<typeof createMovieGenresSchema>;

export type MovieCertification = typeof movieCertifications.$inferSelect;
export type MovieCertificationKey = z.infer<typeof movieCertificationKeySchema>;
export type CreateMovieCertificationInput = z.infer<typeof createMovieCertificationSchema>;
export type UpdateMovieCertificationInput = z.infer<typeof updateMovieCertificationSchema>;
