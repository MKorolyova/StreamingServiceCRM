import { randomUUID } from "node:crypto";
import type { PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

import {
  campaignTargets,
  campaigns,
  countries,
  devices,
  genres,
  movieCertifications,
  movieGenres,
  movies,
  payments,
  plans,
  profiles,
  promoCodeRedemptions,
  promoCodes,
  ratings,
  subscribers,
  subscriptions,
  watchSessions,
} from "./schema";

import { SEED_CAMPAIGN_TARGETS } from "./seed-campaign-targets";
import { SEED_CAMPAIGNS } from "./seed-campaigns";
import { SEED_COUNTRIES } from "./seed-countries";
import { SEED_DEVICES } from "./seed-devices";
import { SEED_GENRES } from "./seed-genres";
import { SEED_MOVIE_CERTIFICATIONS } from "./seed-movie-certifications";
import { SEED_MOVIES } from "./seed-movies";
import { SEED_PAYMENTS } from "./seed-payments";
import { SEED_PLANS } from "./seed-plans";
import { SEED_PROFILES } from "./seed-profiles";
import { SEED_PROMO_CODE_REDEMPTIONS } from "./seed-promo-code-redemptions";
import { SEED_PROMO_CODES } from "./seed-promo-codes";
import { SEED_RATINGS } from "./seed-ratings";
import { SEED_SUBSCRIBERS } from "./seed-subscribers";
import { SEED_SUBSCRIPTIONS } from "./seed-subscriptions";
import { SEED_WATCH_SESSIONS } from "./seed-watch-sessions";


type IdByKey = Map<string, string>;

function getId(idByKey: IdByKey, key: string) {
  const id = idByKey.get(key);
  if (!id) throw new Error(`Seed data references "${key}", which is not in its seed file.`);
  return id;
}

function createCountries() {
  return SEED_COUNTRIES.map(([countryCode, name, currencyCode]) => ({
    countryCode,
    name,
    currencyCode
  }));
}

function createGenres() {
  return SEED_GENRES.map((name) => ({
    genreId: randomUUID(),
    name
  }));
}

function createMovies() {
  return SEED_MOVIES.map(([title, releaseYear, runtimeMinutes, maturityRating]) => ({
    movieId: randomUUID(),
    title,
    releaseYear,
    runtimeMinutes,
    maturityRating,
  }));
}

function createDevices() {
  return SEED_DEVICES.map(({ type, os, model }) => ({
    deviceId: randomUUID(),
    type,
    os,
    model,
  }));
}

function createPlans() {
  return SEED_PLANS.map(({ name, monthlyPriceCents, maxStreams, maxProfiles, resolution }) => ({
    planId: randomUUID(),
    name,
    monthlyPriceCents,
    maxStreams,
    maxProfiles,
    resolution,
  }));
}

function createCampaigns() {
  return SEED_CAMPAIGNS.map(({ type, name, startDate, endDate }) => ({
    campaignId: randomUUID(),
    name,
    type,
    startDate,
    endDate,
  }));
}

function createPromoCodes() {
  return SEED_PROMO_CODES.map(([code, discountPercent, maxUses, expiryDate]) => ({
    code,
    discountPercent,
    maxUses,
    expiryDate,
  }));
}

function createSubscribers() {
  return SEED_SUBSCRIBERS.map(([name, email, createdAt, status, countryCode]) => ({
    subscriberId: randomUUID(),
    name,
    email,
    createdAt: new Date(createdAt),
    status,
    countryCode,
  }));
}


function createMovieGenres(movieIdByTitle: IdByKey, genreIdByName: IdByKey) {
  return SEED_MOVIES.flatMap(([title, , , , genreNames]) => genreNames.map((genreName) => ({
    movieId: getId(movieIdByTitle, title),
    genreId: getId(genreIdByName, genreName),
  })));
}

function createMovieCertifications(movieIdByTitle: IdByKey) {
  return SEED_MOVIE_CERTIFICATIONS.map(([movieTitle, countryCode, certification]) => ({
    movieId: getId(movieIdByTitle, movieTitle),
    countryCode,
    certification,
  }));
}

function createProfiles(subscriberIdByEmail: IdByKey) {
  return SEED_PROFILES.map(([subscriberEmail, profileName, maturityLevel, language, isDefault]) => ({
    subscriberId: getId(subscriberIdByEmail, subscriberEmail),
    profileName,
    maturityLevel,
    language,
    isDefault,
  }));
}

function createSubscriptions(subscriberIdByEmail: IdByKey, planIdByName: IdByKey) {
  return SEED_SUBSCRIPTIONS.map(([subscriberEmail, planName, startDate, endDate, cancelReason]) => ({
    subscriberId: getId(subscriberIdByEmail, subscriberEmail),
    planId: getId(planIdByName, planName),
    startDate,
    endDate,
    cancelReason,
  }));
}

function createPayments(subscriberIdByEmail: IdByKey) {
  return SEED_PAYMENTS.map(([subscriberEmail, amountCents, createdAt, method, status]) => ({
    paymentId: randomUUID(),
    amountCents,
    createdAt: new Date(createdAt),
    method,
    status,
    subscriberId: getId(subscriberIdByEmail, subscriberEmail),
  }));
}

function createWatchSessions(subscriberIdByEmail: IdByKey, movieIdByTitle: IdByKey, deviceIdByModel: IdByKey) {
  return SEED_WATCH_SESSIONS.map(([subscriberEmail, profileName, movieTitle, deviceModel, watchedAt, minutesWatched, completed]) => ({
    subscriberId: getId(subscriberIdByEmail, subscriberEmail),
    profileName,
    movieId: getId(movieIdByTitle, movieTitle),
    deviceId: getId(deviceIdByModel, deviceModel),
    watchedAt: new Date(watchedAt),
    minutesWatched,
    completed,
  }));
}

function createRatings(subscriberIdByEmail: IdByKey, movieIdByTitle: IdByKey) {
  return SEED_RATINGS.map(([subscriberEmail, profileName, movieTitle, stars, ratedDate]) => ({
    subscriberId: getId(subscriberIdByEmail, subscriberEmail),
    profileName,
    movieId: getId(movieIdByTitle, movieTitle),
    stars,
    ratedDate,
  }));
}

function createCampaignTargets(campaignIdByName: IdByKey, subscriberIdByEmail: IdByKey) {
  return SEED_CAMPAIGN_TARGETS.map(([campaignName, subscriberEmail, sentDate, response]) => ({
    campaignId: getId(campaignIdByName, campaignName),
    subscriberId: getId(subscriberIdByEmail, subscriberEmail),
    sentDate,
    response,
  }));
}

function createPromoCodeRedemptions(subscriberIdByEmail: IdByKey, campaignIdByName: IdByKey) {
  return SEED_PROMO_CODE_REDEMPTIONS.map(([subscriberEmail, code, campaignName, redeemedDate]) => ({
    subscriberId: getId(subscriberIdByEmail, subscriberEmail),
    code,
    campaignId: getId(campaignIdByName, campaignName),
    redeemedDate,
  }));
}

const DOMAIN_TABLES: PgTable[] = [
  countries,
  plans,
  genres,
  devices,
  movies,
  campaigns,
  promoCodes,
  subscribers,
  movieGenres,
  movieCertifications,
  profiles,
  subscriptions,
  payments,
  watchSessions,
  ratings,
  campaignTargets,
  promoCodeRedemptions,
];

type Database = ReturnType<typeof drizzle>;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

async function insertRows(tx: Transaction, table: PgTable, rows: Record<string, unknown>[]) {
  await tx.insert(table).values(rows);
}

async function seed(reset: boolean) {

  const client = postgres(env.POSTGRES_URL);
  const db = drizzle(client, { schema });

  try {

    const subscribersCount = await db.$count(subscribers);
    const countriesCount = await db.$count(countries);
    const plansCount = await db.$count(plans);
    const genresCount = await db.$count(genres);
    const devicesCount = await db.$count(devices);

    if (!reset && (subscribersCount > 0 || countriesCount > 0 || plansCount > 0 || genresCount > 0 || devicesCount > 0)) {
      throw new Error("The database already contains domain data. Run `pnpm db:seed --reset` to delete it and reseed.");
    }

    const countryRows = createCountries();
    const planRows = createPlans();
    const genreRows = createGenres();
    const deviceRows = createDevices();
    const movieRows = createMovies();
    const campaignRows = createCampaigns();
    const promoCodeRows = createPromoCodes();
    const subscriberRows = createSubscribers();

    const planIdByName: IdByKey = new Map(planRows.map((plan) => [plan.name, plan.planId]));
    const genreIdByName: IdByKey = new Map(genreRows.map((genre) => [genre.name, genre.genreId]));
    const deviceIdByModel: IdByKey = new Map(deviceRows.map((device) => [device.model, device.deviceId]));
    const movieIdByTitle: IdByKey = new Map(movieRows.map((movie) => [movie.title, movie.movieId]));
    const campaignIdByName: IdByKey = new Map(campaignRows.map((campaign) => [campaign.name, campaign.campaignId]));
    const subscriberIdByEmail: IdByKey = new Map(subscriberRows.map((subscriber) => [subscriber.email, subscriber.subscriberId]));

    await db.transaction(async (tx) => {

      if (reset) {
        for (const table of [...DOMAIN_TABLES].reverse()) {
          await tx.delete(table);
        }
      }

      await insertRows(tx, countries, countryRows);
      await insertRows(tx, plans, planRows);
      await insertRows(tx, genres, genreRows);
      await insertRows(tx, devices, deviceRows);
      await insertRows(tx, movies, movieRows);
      await insertRows(tx, campaigns, campaignRows);
      await insertRows(tx, promoCodes, promoCodeRows);
      await insertRows(tx, subscribers, subscriberRows);
      await insertRows(tx, movieGenres, createMovieGenres(movieIdByTitle, genreIdByName));
      await insertRows(tx, movieCertifications, createMovieCertifications(movieIdByTitle));
      await insertRows(tx, profiles, createProfiles(subscriberIdByEmail));
      await insertRows(tx, subscriptions, createSubscriptions(subscriberIdByEmail, planIdByName));
      await insertRows(tx, payments, createPayments(subscriberIdByEmail));
      await insertRows(tx, watchSessions, createWatchSessions(subscriberIdByEmail, movieIdByTitle, deviceIdByModel));
      await insertRows(tx, ratings, createRatings(subscriberIdByEmail, movieIdByTitle));
      await insertRows(tx, campaignTargets, createCampaignTargets(campaignIdByName, subscriberIdByEmail));
      await insertRows(tx, promoCodeRedemptions, createPromoCodeRedemptions(subscriberIdByEmail, campaignIdByName));
    });

    console.log(`Seeded was successfully saved.`);
    
  } finally {
    await client.end();
  }
}

seed(process.argv.includes("--reset")).catch((error: unknown) => {
  console.error(error instanceof Error ? `Seed failed: ${error.message}` : error);
  process.exit(1);
});
