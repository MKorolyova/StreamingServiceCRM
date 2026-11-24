import { and, asc, avg, count, desc, eq, gt, gte, isNull, lte, max, sql, sum } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/db";
import { devices, plans, profiles, subscriptions, watchSessions } from "@/db/schema";
import { addMinutesTo, utcHourOf, utcWeekdayOf } from "@/lib/sql-dates";
import type { DeviceType } from "@/types/devices";

export type ActivityTotals = {
  sessions: number;
  profiles: number;
  watchingProfiles: number;
  inactiveProfiles: number;
};

export async function getActivityTotals(inactiveSince: Date): Promise<ActivityTotals> {

    const watchedByProfile = db
    .select({
      subscriberId: watchSessions.subscriberId,
      profileName: watchSessions.profileName,
      sessions: count().as("sessions"),
    })
    .from(watchSessions)
    .groupBy(watchSessions.subscriberId, watchSessions.profileName)
    .as("watched_by_profile");

  const recentlyWatched = db
    .selectDistinct({ 
      subscriberId: watchSessions.subscriberId, 
      profileName: watchSessions.profileName 
    })
    .from(watchSessions)
    .where(gte(watchSessions.watchedAt, inactiveSince))
    .as("recently_watched");

  const [row] = await db
    .select({
      sessions: sum(watchedByProfile.sessions).mapWith(Number),
      profiles: count(),
      watchingProfiles: count(watchedByProfile.profileName),
      recentlyWatchingProfiles: count(recentlyWatched.profileName),
    })
    .from(profiles)
    .leftJoin(watchedByProfile,
      and(
        eq(watchedByProfile.subscriberId, profiles.subscriberId),
        eq(watchedByProfile.profileName, profiles.profileName),
      ),
    )
    .leftJoin(recentlyWatched,
      and(
        eq(recentlyWatched.subscriberId, profiles.subscriberId),
        eq(recentlyWatched.profileName, profiles.profileName),
      ),
    );

  if (!row) return { 
    sessions: 0, 
    profiles: 0, 
    watchingProfiles: 0, 
    inactiveProfiles: 0 
  };

  return {
    sessions: row.sessions ?? 0,
    profiles: row.profiles,
    watchingProfiles: row.watchingProfiles,
    inactiveProfiles: row.profiles - row.recentlyWatchingProfiles,
  };
}

export type WatchTimeSlot = {
  dayOfWeek: number;
  hour: number;
  minutesWatched: number;
};

export async function listWatchTimeByWeekdayAndHour(): Promise<WatchTimeSlot[]> {
  return db
    .select({ 
      dayOfWeek:utcWeekdayOf(watchSessions.watchedAt),
      hour: utcHourOf(watchSessions.watchedAt),
      minutesWatched: sum(watchSessions.minutesWatched).mapWith(Number) })
    .from(watchSessions)
    .groupBy(utcWeekdayOf(watchSessions.watchedAt), utcHourOf(watchSessions.watchedAt));
}

export type DeviceTypeCompletion = {
  deviceType: DeviceType;
  sessions: number;
  completedSessions: number;
};

export async function listCompletionByDeviceType(): Promise<DeviceTypeCompletion[]> {
  return db
    .select({
      deviceType: devices.type,
      sessions: count(),
      completedSessions: count(sql`case when ${watchSessions.completed} then 1 end`),
    })
    .from(watchSessions)
    .innerJoin(devices, eq(devices.deviceId, watchSessions.deviceId))
    .groupBy(devices.type)
    .orderBy(desc(count()));
}

export type PlanConcurrency = {
  planName: string;
  maxStreams: number;
  subscribers: number;
  peakStreams: number;
  averagePeakStreams: number;
  subscribersOverLimit: number;
};

export async function listPeakConcurrencyByPlan(): Promise<PlanConcurrency[]> {

  const otherSession = alias(watchSessions, "other_session");
  const sessionStreams = db
    .select({
      subscriberId: watchSessions.subscriberId,
      streams: count(otherSession.subscriberId).as("streams"),
    })
    .from(watchSessions)
    .leftJoin(
      otherSession,
      and(
        eq(otherSession.subscriberId, watchSessions.subscriberId),
        lte(otherSession.watchedAt, watchSessions.watchedAt),
        gt(addMinutesTo(otherSession.watchedAt, otherSession.minutesWatched), watchSessions.watchedAt),
      ),
    )
    .groupBy(
      watchSessions.subscriberId,
      watchSessions.profileName,
      watchSessions.movieId,
      watchSessions.deviceId,
      watchSessions.watchedAt,
    )
    .as("session_streams");

  const subscriberPeaks = db.$with("subscriber_peaks").as(db
      .select({
        planId: subscriptions.planId,
        peak: max(sessionStreams.streams).as("peak"),
      })
      .from(sessionStreams)
      .innerJoin(subscriptions, eq(subscriptions.subscriberId, sessionStreams.subscriberId))
      .where(isNull(subscriptions.endDate))
      .groupBy(subscriptions.planId, subscriptions.subscriberId),
  );

  const overLimit = db
    .select({ subscribers: count().as("subscribers") })
    .from(subscriberPeaks)
    .where(
      and(
        eq(subscriberPeaks.planId, plans.planId),
        gt(subscriberPeaks.peak, plans.maxStreams),
      ),
    )
    .as("over_limit");

  const rows = await db
    .with(subscriberPeaks)
    .select({
      planName: plans.name,
      maxStreams: plans.maxStreams,
      subscribers: count(subscriberPeaks.planId),
      peakStreams: max(subscriberPeaks.peak).mapWith(Number),
      averagePeakStreams: avg(subscriberPeaks.peak).mapWith(Number),
      subscribersOverLimit: overLimit,
    })
    .from(plans)
    .leftJoin(subscriberPeaks,  eq(subscriberPeaks.planId, plans.planId))
    .groupBy(plans.planId, plans.name, plans.maxStreams, plans.monthlyPriceCents)
    .orderBy(plans.monthlyPriceCents);

  return rows.map((row) => ({
    planName: row.planName,
    maxStreams: row.maxStreams,
    subscribers: row.subscribers,
    peakStreams: row.peakStreams ?? 0,
    averagePeakStreams: row.averagePeakStreams ?? 0,
    subscribersOverLimit: row.subscribersOverLimit,
  }));
}
