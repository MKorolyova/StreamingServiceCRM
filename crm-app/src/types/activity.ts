import type { z } from "zod";
import type { ratings, watchSessions } from "@/db/schema";
import type {
  createRatingSchema,
  createWatchSessionSchema,
  paginationRatingsQuerySchema,
  paginationWatchSessionsQuerySchema,
  ratingKeySchema,
  updateRatingSchema,
  updateWatchSessionSchema,
  watchSessionKeySchema,
} from "@/validators/activity";

export type WatchSession = typeof watchSessions.$inferSelect;
export type WatchSessionKey = z.infer<typeof watchSessionKeySchema>;
export type CreateWatchSessionInput = z.infer<typeof createWatchSessionSchema>;
export type UpdateWatchSessionInput = z.infer<typeof updateWatchSessionSchema>;
export type ListWatchSessionsQuery = z.infer<typeof paginationWatchSessionsQuerySchema>;

export type Rating = typeof ratings.$inferSelect;
export type RatingKey = z.infer<typeof ratingKeySchema>;
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>;
export type ListRatingsQuery = z.infer<typeof paginationRatingsQuerySchema>;
