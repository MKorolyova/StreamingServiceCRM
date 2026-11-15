import { z } from "zod";
import {
  isoDateSchema,
  uuidSchema,
  paginationSchema,
} from "./common";


// ---------------------------------------------------------------------------
// Watch sessions
// ---------------------------------------------------------------------------

const profileNameSchema = z.string().trim().min(1, "Profile name is required").max(50, "Profile name is too long");
const minutesWatchedSchema = z.number("Minutes watched must be a number").int("Minutes watched must be a whole number").min(0, "Minutes watched cannot be negative").max(32_767, "Minutes watched is too large");

export const watchSessionKeySchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
  movieId: uuidSchema,
  deviceId: uuidSchema,
  watchedAt: z.coerce.date("Watched at must be a valid date"),
});

export const createWatchSessionSchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
  movieId: uuidSchema,
  deviceId: uuidSchema,
  watchedAt: z.coerce.date("Watched at must be a valid date"),
  minutesWatched: minutesWatchedSchema.optional(),
  completed: z.boolean("Completed must be true or false").optional(),
})
  .refine((session) => session.watchedAt <= new Date(), { message: "Watched at cannot be in the future", path: ["watchedAt"] });

export const updateWatchSessionSchema = z.object({
  minutesWatched: minutesWatchedSchema,
  completed: z.boolean("Completed must be true or false"),
})
  .partial();

export const paginationWatchSessionsQuerySchema = paginationSchema.extend({
  subscriberId: uuidSchema.optional(),
  profileName: profileNameSchema.optional(),
  movieId: uuidSchema.optional(),
  deviceId: uuidSchema.optional(),
  completed: z.stringbool().optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
})
  .refine((query) => !query.from || !query.to || query.to >= query.from, { message: "End date must be on or after the start date", path: ["to"] });

// ---------------------------------------------------------------------------
// Ratings
// ---------------------------------------------------------------------------

const starsSchema = z.number("Stars must be a number").int("Stars must be a whole number").min(1, "Minimum is 1 star").max(5, "Maximum is 5 stars");

export const ratingKeySchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
  movieId: uuidSchema,
});

export const createRatingSchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
  movieId: uuidSchema,
  stars: starsSchema,
  ratedDate: isoDateSchema.optional(),
});

export const updateRatingSchema = z.object({
  stars: starsSchema,
  ratedDate: isoDateSchema.optional(),
});

export const paginationRatingsQuerySchema = paginationSchema.extend({
  subscriberId: uuidSchema.optional(),
  profileName: profileNameSchema.optional(),
  movieId: uuidSchema.optional(),
  stars: z.coerce.number().pipe(starsSchema).optional(),
});
