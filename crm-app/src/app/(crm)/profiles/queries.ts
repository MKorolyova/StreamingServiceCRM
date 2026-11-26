import { and, count, countDistinct, desc, eq, gt, gte, isNull, lte } from "drizzle-orm";
import { db } from "@/db";
import { plans, profiles, subscriptions } from "@/db/schema";

export type MaturityCount = {
  maturityLevel: (typeof profiles.$inferSelect)["maturityLevel"];
  profiles: number;
};

export async function listProfilesByMaturityLevel(): Promise<MaturityCount[]> {
  return db
    .select({ maturityLevel: profiles.maturityLevel, profiles: count() })
    .from(profiles)
    .groupBy(profiles.maturityLevel);
}

export type LanguageCount = {
  language: string;
  profiles: number;
};

export async function listProfilesByLanguage(): Promise<LanguageCount[]> {
  return db
    .select({ language: profiles.language, profiles: count() })
    .from(profiles)
    .groupBy(profiles.language)
    .orderBy(desc(count()), profiles.language);
}

export type PlanProfileUsage = {
  planName: string;
  maxProfiles: number;
  subscribers: number;
  profiles: number;
  subscribersAtLimit: number;
  subscribersWithOneProfile: number;
};

export async function listProfileUsageByPlan(): Promise<PlanProfileUsage[]> {
  const subscriberProfiles = db
  .$with("subscriber_profiles").as(
    db
      .select({
        planId: subscriptions.planId,
        subscriberId: subscriptions.subscriberId,
        profileCount: count(profiles.profileName).as("profile_count"),
      })
      .from(subscriptions)
      .leftJoin(profiles, eq(profiles.subscriberId, subscriptions.subscriberId))
      .where(isNull(subscriptions.endDate))
      .groupBy(subscriptions.planId, subscriptions.subscriberId),
  );

  return db
    .with(subscriberProfiles)
    .select({
      planName: plans.name,
      maxProfiles: plans.maxProfiles,
      subscribers: countDistinct(subscriptions.subscriberId),
      profiles: count(profiles.profileName),
      subscribersAtLimit: db.$count(subscriberProfiles, and(eq(subscriberProfiles.planId, plans.planId), gte(subscriberProfiles.profileCount, plans.maxProfiles))),
      subscribersWithOneProfile: db.$count(subscriberProfiles, and(eq(subscriberProfiles.planId, plans.planId), and(lte(subscriberProfiles.profileCount, 1), gt(plans.maxProfiles, 1)))),
    })
    .from(plans)
    .leftJoin(subscriptions, and(eq(subscriptions.planId, plans.planId), isNull(subscriptions.endDate)))
    .leftJoin(profiles, eq(profiles.subscriberId, subscriptions.subscriberId))
    .groupBy(plans.planId, plans.name, plans.maxProfiles, plans.monthlyPriceCents)
    .orderBy(plans.monthlyPriceCents);
}
