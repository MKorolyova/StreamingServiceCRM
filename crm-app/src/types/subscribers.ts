import type { z } from "zod";
import type { profiles, subscribers, subscriptions } from "@/db/schema";
import type {
  cancelSubscriptionSchema,
  createProfileSchema,
  createSubscriberSchema,
  createSubscriptionSchema,
  paginationSubscribersSchema,
  profileKeySchema,
  subscriberKeySchema,
  subscriberStatusSchema,
  subscriptionKeySchema,
  updateProfileSchema,
  updateSubscriberSchema,
  updateSubscriptionSchema,
} from "@/validators/subscribers";

export type SubscriberStatus = z.infer<typeof subscriberStatusSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type SubscriberKey = z.infer<typeof subscriberKeySchema>;
export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>;
export type UpdateSubscriberInput = z.infer<typeof updateSubscriberSchema>;
export type ListSubscribersQuery = z.infer<typeof paginationSubscribersSchema>;

export type Profile = typeof profiles.$inferSelect;
export type ProfileKey = z.infer<typeof profileKeySchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type SubscriptionKey = z.infer<typeof subscriptionKeySchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
