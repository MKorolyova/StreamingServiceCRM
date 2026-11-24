import { and, count, desc, eq, isNull, max, sum } from "drizzle-orm";

import { db } from "@/db";
import {
  campaigns,
  campaignTargets,
  countries,
  devices,
  payments,
  plans,
  profiles,
  promoCodeRedemptions,
  promoCodes,
  subscribers,
  subscriptions,
  watchSessions,
} from "@/db/schema";
import type { CampaignResponse } from "@/types/campaigns";
import type { CampaignType } from "@/types/campaigns";
import type { DeviceType } from "@/types/devices";
import type { Payment } from "@/types/payments";
import type { Profile } from "@/types/subscribers";
import type { SubscriberStatus } from "@/types/subscribers";

export type SubscriberDetails = {
  name: string;
  email: string;
  status: SubscriberStatus;
  createdAt: Date;
  countryName: string;
  currencyCode: string;
  planName: string | null;
  planPriceCents: number | null;
  minutesWatched: number;
};

export async function getSubscriberById(subscriberId: string): Promise<SubscriberDetails | null> {
  const [[subscriber], [watched]] = await Promise.all([
    db
      .select({
        subscriberId: subscribers.subscriberId,
        name: subscribers.name,
        email: subscribers.email,
        status: subscribers.status,
        createdAt: subscribers.createdAt,
        countryName: countries.name,
        currencyCode: countries.currencyCode,
        planName: plans.name,
        planPriceCents: plans.monthlyPriceCents,
      })
      .from(subscribers)
      .innerJoin(countries, eq(countries.countryCode, subscribers.countryCode))
      .leftJoin(subscriptions, and(eq(subscriptions.subscriberId, subscribers.subscriberId), isNull(subscriptions.endDate)))
      .leftJoin(plans, eq(plans.planId, subscriptions.planId))
      .where(eq(subscribers.subscriberId, subscriberId)),

    db
      .select({ minutes: sum(watchSessions.minutesWatched).mapWith(Number) })
      .from(watchSessions)
      .where(eq(watchSessions.subscriberId, subscriberId)),
  ]);

  if (!subscriber) return null;
  return {
    name: subscriber.name,
    email: subscriber.email,
    status: subscriber.status,
    createdAt: subscriber.createdAt,
    countryName: subscriber.countryName,
    currencyCode: subscriber.currencyCode,
    planName: subscriber.planName,
    planPriceCents: subscriber.planPriceCents,
    minutesWatched: watched?.minutes ?? 0,
  };

}

export type SubscriptionHistoryEntry = {
  planName: string;
  monthlyPriceCents: number;
  startDate: string;
  endDate: string | null;
  cancelReason: string | null;
};

export async function listSubscriptionHistory(subscriberId: string): Promise<SubscriptionHistoryEntry[]> {
  return db
    .select({
      planName: plans.name,
      monthlyPriceCents: plans.monthlyPriceCents,
      startDate: subscriptions.startDate,
      endDate: subscriptions.endDate,
      cancelReason: subscriptions.cancelReason,
    })
    .from(subscriptions)
    .innerJoin(plans, eq(plans.planId, subscriptions.planId))
    .where(eq(subscriptions.subscriberId, subscriberId))
    .orderBy(desc(subscriptions.startDate));
}

export type CampaignTouch = {
  campaignId: string;
  campaignName: string;
  campaignType: CampaignType;
  sentDate: string;
  response: CampaignResponse;
};

export async function listCampaignTouches(subscriberId: string): Promise<CampaignTouch[]> {
  return db
    .select({
      campaignId: campaigns.campaignId,
      campaignName: campaigns.name,
      campaignType: campaigns.type,
      sentDate: campaignTargets.sentDate,
      response: campaignTargets.response,
    })
    .from(campaignTargets)
    .innerJoin(campaigns, eq(campaigns.campaignId, campaignTargets.campaignId))
    .where(eq(campaignTargets.subscriberId, subscriberId))
    .orderBy(desc(campaignTargets.sentDate), campaigns.name);
}

export type PromoRedemption = {
  code: string;
  discountPercent: number;
  campaignName: string;
  redeemedDate: string;
};

export async function listPromoRedemptions(subscriberId: string): Promise<PromoRedemption[]> {
  return db
    .select({
      code: promoCodeRedemptions.code,
      discountPercent: promoCodes.discountPercent,
      campaignName: campaigns.name,
      redeemedDate: promoCodeRedemptions.redeemedDate,
    })
    .from(promoCodeRedemptions)
    .innerJoin(promoCodes, eq(promoCodes.code, promoCodeRedemptions.code))
    .innerJoin(campaigns, eq(campaigns.campaignId, promoCodeRedemptions.campaignId))
    .where(eq(promoCodeRedemptions.subscriberId, subscriberId))
    .orderBy(desc(promoCodeRedemptions.redeemedDate), promoCodeRedemptions.code);
}

export type DeviceUsed = {
  deviceId: string;
  model: string;
  os: string;
  deviceType: DeviceType;
  profileNames: string[];
  sessions: number;
  minutesWatched: number;
  lastWatchedAt: Date;
};

export async function listDevicesUsed(subscriberId: string): Promise<DeviceUsed[]> {
  const [deviceRows, profileRows] = await Promise.all([
    db
      .select({
        deviceId: devices.deviceId,
        model: devices.model,
        os: devices.os,
        deviceType: devices.type,
        sessions: count(),
        minutesWatched: sum(watchSessions.minutesWatched).mapWith(Number),
        lastWatchedAt: max(watchSessions.watchedAt).mapWith(watchSessions.watchedAt),
      })
      .from(watchSessions)
      .innerJoin(devices, eq(devices.deviceId, watchSessions.deviceId))
      .where(eq(watchSessions.subscriberId, subscriberId))
      .groupBy(devices.deviceId, devices.model, devices.os, devices.type)
      .orderBy(desc(max(watchSessions.watchedAt))),

    db
      .selectDistinct({ deviceId: watchSessions.deviceId, profileName: watchSessions.profileName })
      .from(watchSessions)
      .where(eq(watchSessions.subscriberId, subscriberId))
      .orderBy(watchSessions.profileName),
  ]);

  return deviceRows.map((device) => ({
    deviceId: device.deviceId,
    model: device.model,
    os: device.os,
    deviceType: device.deviceType,
    sessions: device.sessions,
    minutesWatched: device.minutesWatched,
    lastWatchedAt: device.lastWatchedAt,
    profileNames: profileRows
      .filter((row) => row.deviceId === device.deviceId)
      .map((row) => row.profileName),
  }));
}

export async function listSubscriberProfiles(subscriberId: string): Promise<Profile[]> {
  return db
    .select()
    .from(profiles)
    .where(eq(profiles.subscriberId, subscriberId))
    .orderBy(desc(profiles.isDefault), profiles.profileName);
}

export async function listSubscriberPayments(subscriberId: string): Promise<Payment[]> {
  return db
    .select()
    .from(payments)
    .where(eq(payments.subscriberId, subscriberId))
    .orderBy(desc(payments.createdAt));
}
