import { z } from "zod";
import {
  dateRangeQuerySchema,
  isoDateSchema,
  listQuerySchema,
  requireAtLeastOneField,
  uuidSchema,
} from "./common";

const profileNameSchema = z.string().trim().min(1, "Profile name is required").max(50, "Profile name is too long");

// ---------------------------------------------------------------------------
// Watch sessions
// ---------------------------------------------------------------------------

export const watchSessionKeySchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
  movieId: uuidSchema,
  deviceId: uuidSchema,
  // Arrives as an ISO string over JSON / form data.
  watchedAt: z.coerce.date("Watched at must be a valid date"),
});

const watchProgressSchema = z.object({
  minutesWatched: z.number("Minutes watched must be a number").int("Minutes watched must be a whole number").min(0, "Minutes watched cannot be negative").max(32_767, "Minutes watched is too large").optional(),
  completed: z.boolean("Completed must be true or false").optional(),
});

// minutesWatched <= movie runtime needs the movie row, so it's checked in the service layer.
export const createWatchSessionSchema = watchSessionKeySchema.extend(watchProgressSchema.shape)
  .refine((session) => session.watchedAt <= new Date(), { message: "Watched at cannot be in the future", path: ["watchedAt"] });

export const updateWatchSessionSchema = requireAtLeastOneField(watchProgressSchema);

export const listWatchSessionsQuerySchema = listQuerySchema(["watchedAt", "minutesWatched"])
  .extend({
    subscriberId: uuidSchema.optional(),
    profileName: profileNameSchema.optional(),
    movieId: uuidSchema.optional(),
    deviceId: uuidSchema.optional(),
    completed: z.stringbool().optional(),
  })
  .and(dateRangeQuerySchema);

// ---------------------------------------------------------------------------
// Ratings
// ---------------------------------------------------------------------------

const starsSchema = z.number("Stars must be a number").int("Stars must be a whole number").min(1, "Minimum is 1 star").max(5, "Maximum is 5 stars");

export const ratingKeySchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
  movieId: uuidSchema,
});

export const updateRatingSchema = z.object({
  stars: starsSchema,
  ratedDate: isoDateSchema.optional(),
});

export const createRatingSchema = ratingKeySchema.extend(updateRatingSchema.shape);

export const listRatingsQuerySchema = listQuerySchema(["ratedDate", "stars"]).extend({
  subscriberId: uuidSchema.optional(),
  profileName: profileNameSchema.optional(),
  movieId: uuidSchema.optional(),
  stars: z.coerce.number().pipe(starsSchema).optional(),
});
