import { relations, sql } from "drizzle-orm";
import {
  boolean,
  char,
  check,
  date,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const subscriberStatusEnum = pgEnum("SubscriberStatus", ["ACTIVE", "PAUSED", "CANCELED"]);
export const maturityLevelEnum = pgEnum("MaturityLevel", ["KIDS", "TEEN", "ADULT"]);
export const resolutionEnum = pgEnum("Resolution", ["SD", "HD", "FULL_HD", "ULTRA_HD"]);
export const paymentStatusEnum = pgEnum("PaymentStatus", ["PAID", "FAILED", "REFUNDED"]);
export const campaignTypeEnum = pgEnum("CampaignType", ["PROMO", "WIN_BACK", "NEW_RELEASE"]);
export const deviceTypeEnum = pgEnum("DeviceType", ["TV", "PHONE", "TABLET", "BROWSER"]);
export const campaignResponseEnum = pgEnum("CampaignResponse", ["SENT","OPENED","CLICKED","REDEEMED","IGNORED"]);
export const userRoleEnum = pgEnum("UserRole", ["ADMIN","SUPPORT_AGENT","BILLING","MARKETING","CONTENT_MANAGER","ANALYST"]);

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

export const countries = pgTable("countries", {
  countryCode: char({ length: 2 }).primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  currencyCode: char({ length: 3 }).notNull(),
});

export const subscribers = pgTable("subscribers", {
    subscriberId: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    signupDate: date().notNull().defaultNow(),
    status: subscriberStatusEnum().notNull().default("ACTIVE"),
    // Lives_In
    countryCode: char({ length: 2 }).notNull().references(() => countries.countryCode, { onDelete: "restrict" }),
  },
  (t) => [index("subscribers_country_code_idx").on(t.countryCode)],
);

// Weak entity of Subscriber (Has_Profile).
export const profiles = pgTable("profiles", {
    subscriberId: integer().notNull().references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    profileName: varchar({ length: 50 }).notNull(),
    maturityLevel: maturityLevelEnum().notNull().default("ADULT"),
    language: varchar({ length: 10 }).notNull().default("en"),
    isDefault: boolean().notNull().default(false),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.profileName] }),
    // At most one default per account; "at least one" is a deferred trigger.
    uniqueIndex("profiles_one_default_per_subscriber_idx").on(t.subscriberId).where(sql`${t.isDefault}`),
    check("profiles_profile_name_not_blank", sql`length(trim(${t.profileName})) > 0`),
  ],
);

export const plans = pgTable("plans", {
    planId: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 50 }).notNull().unique(),
    monthlyPriceCents: integer().notNull(),
    maxStreams: smallint().notNull(),
    maxProfiles: smallint().notNull(),
    resolution: resolutionEnum().notNull(),
  },
  (t) => [
    check("plans_monthly_price_cents_non_negative", sql`${t.monthlyPriceCents} >= 0`),
    check("plans_max_streams_positive", sql`${t.maxStreams} > 0`),
    check("plans_max_profiles_positive", sql`${t.maxProfiles} > 0`),
  ],
);

export const movies = pgTable("movies", {
    movieId: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    releaseYear: smallint().notNull(),
    runtimeMinutes: smallint().notNull(),
    maturityRating: maturityLevelEnum().notNull(),
  },
  (t) => [
    check("movies_release_year_range", sql`${t.releaseYear} BETWEEN 1888 AND 2100`),
    check("movies_runtime_minutes_positive", sql`${t.runtimeMinutes} > 0`),
  ],
);

export const genres = pgTable("genres", {
  genreId: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 50 }).notNull().unique(),
});

export const payments = pgTable("payments", {
    paymentId: integer().primaryKey().generatedAlwaysAsIdentity(),
    amountCents: integer().notNull(),
    paymentDate: date().notNull().defaultNow(),
    method: varchar({ length: 30 }).notNull(),
    status: paymentStatusEnum().notNull(),
    // Pays
    subscriberId: integer()
      .notNull()
      .references(() => subscribers.subscriberId, { onDelete: "restrict" }),
  },
  (t) => [
    check("payments_amount_cents_positive", sql`${t.amountCents} > 0`),
    index("payments_subscriber_id_idx").on(t.subscriberId),
  ],
);

export const campaigns = pgTable("campaigns", {
    campaignId: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    type: campaignTypeEnum().notNull(),
    startDate: date().notNull(),
    endDate: date().notNull(),
  },
  (t) => [check("campaigns_end_date_after_start_date", sql`${t.endDate} >= ${t.startDate}`)],
);

export const promoCodes = pgTable("promo_codes", {
    code: varchar({ length: 50 }).primaryKey(),
    discountPercent: smallint().notNull(),
    maxUses: integer().notNull(),
    expiryDate: date().notNull(),
  },
  (t) => [
    check("promo_codes_discount_percent_range", sql`${t.discountPercent} BETWEEN 1 AND 100`),
    check("promo_codes_max_uses_positive", sql`${t.maxUses} > 0`),
  ],
);

export const devices = pgTable("devices", {
  deviceId: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: deviceTypeEnum().notNull(),
  os: varchar({ length: 50 }).notNull(),
  model: varchar({ length: 100 }).notNull(),
});

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

// Subscribes_To: plan history (upgrades, downgrades, cancellations).
export const subscriptions = pgTable("subscriptions", {
    subscriberId: integer()
      .notNull()
      .references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    planId: integer()
      .notNull()
      .references(() => plans.planId, { onDelete: "restrict" }),
    startDate: date().notNull(),
    endDate: date(),
    cancelReason: text(),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.planId, t.startDate] }),
    check(
      "subscriptions_end_date_after_start_date",
      sql`${t.endDate} IS NULL OR ${t.endDate} > ${t.startDate}`,
    ),
    check(
      "subscriptions_cancel_reason_requires_end_date",
      sql`${t.cancelReason} IS NULL OR ${t.endDate} IS NOT NULL`,
    ),
    // At most one active plan per subscriber.
    uniqueIndex("subscriptions_one_active_per_subscriber_idx")
      .on(t.subscriberId)
      .where(sql`${t.endDate} IS NULL`),
    index("subscriptions_plan_id_idx").on(t.planId),
  ],
);

// Watched: which profile watched which movie on which device.
export const watchSessions = pgTable("watch_sessions", {
    subscriberId: integer().notNull(),
    profileName: varchar({ length: 50 }).notNull(),
    movieId: integer()
      .notNull()
      .references(() => movies.movieId, { onDelete: "restrict" }),
    deviceId: integer()
      .notNull()
      .references(() => devices.deviceId, { onDelete: "restrict" }),
    watchedAt: timestamp({ withTimezone: true }).notNull(),
    minutesWatched: smallint().notNull().default(0),
    completed: boolean().notNull().default(false),
  },
  (t) => [
    primaryKey({
      columns: [t.subscriberId, t.profileName, t.movieId, t.deviceId, t.watchedAt],
    }),
    foreignKey({
      name: "watch_sessions_profile_fk",
      columns: [t.subscriberId, t.profileName],
      foreignColumns: [profiles.subscriberId, profiles.profileName],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    check("watch_sessions_minutes_watched_non_negative", sql`${t.minutesWatched} >= 0`),
    index("watch_sessions_subscriber_watched_at_idx").on(t.subscriberId, t.watchedAt),
    index("watch_sessions_movie_id_idx").on(t.movieId),
    index("watch_sessions_device_id_idx").on(t.deviceId),
  ],
);

// Rated: one rating per profile per movie.
export const ratings = pgTable(
  "ratings",
  {
    subscriberId: integer().notNull(),
    profileName: varchar({ length: 50 }).notNull(),
    movieId: integer()
      .notNull()
      .references(() => movies.movieId, { onDelete: "restrict" }),
    stars: smallint().notNull(),
    ratedDate: date().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.profileName, t.movieId] }),
    foreignKey({
      name: "ratings_profile_fk",
      columns: [t.subscriberId, t.profileName],
      foreignColumns: [profiles.subscriberId, profiles.profileName],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    check("ratings_stars_range", sql`${t.stars} BETWEEN 1 AND 5`),
    index("ratings_movie_id_idx").on(t.movieId),
  ],
);

// Classified_As
export const movieGenres = pgTable(
  "movie_genres",
  {
    movieId: integer()
      .notNull()
      .references(() => movies.movieId, { onDelete: "cascade" }),
    genreId: integer()
      .notNull()
      .references(() => genres.genreId, { onDelete: "restrict" }),
  },
  (t) => [
    primaryKey({ columns: [t.movieId, t.genreId] }),
    index("movie_genres_genre_id_idx").on(t.genreId),
  ],
);

// Redeemed: promotions apply to the account.
export const promoCodeRedemptions = pgTable(
  "promo_code_redemptions",
  {
    subscriberId: integer()
      .notNull()
      .references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    code: varchar({ length: 50 })
      .notNull()
      .references(() => promoCodes.code, { onDelete: "restrict", onUpdate: "cascade" }),
    campaignId: integer()
      .notNull()
      .references(() => campaigns.campaignId, { onDelete: "restrict" }),
    redeemedDate: date().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.code] }),
    index("promo_code_redemptions_code_idx").on(t.code),
    index("promo_code_redemptions_campaign_id_idx").on(t.campaignId),
  ],
);

// Available_In: licensing windows. Non-overlapping windows per movie+country
// are enforced by an exclusion constraint in the custom migration.
export const movieLicenses = pgTable(
  "movie_licenses",
  {
    movieId: integer()
      .notNull()
      .references(() => movies.movieId, { onDelete: "cascade" }),
    countryCode: char({ length: 2 })
      .notNull()
      .references(() => countries.countryCode, { onDelete: "cascade" }),
    licenseStartDate: date().notNull(),
    licenseEndDate: date().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.movieId, t.countryCode, t.licenseStartDate] }),
    check(
      "movie_licenses_end_date_after_start_date",
      sql`${t.licenseEndDate} > ${t.licenseStartDate}`,
    ),
    index("movie_licenses_country_code_idx").on(t.countryCode),
  ],
);

// Targets: marketing sent to the account holder.
export const campaignTargets = pgTable(
  "campaign_targets",
  {
    campaignId: integer()
      .notNull()
      .references(() => campaigns.campaignId, { onDelete: "cascade" }),
    subscriberId: integer()
      .notNull()
      .references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    sentDate: date().notNull().defaultNow(),
    response: campaignResponseEnum().notNull().default("SENT"),
  },
  (t) => [
    primaryKey({ columns: [t.campaignId, t.subscriberId] }),
    index("campaign_targets_subscriber_id_idx").on(t.subscriberId),
  ],
);

// ---------------------------------------------------------------------------
// Staff users and access control
// ---------------------------------------------------------------------------

// What each role is allowed to do lives in `src/lib/auth/permissions.ts`.


// CRM staff accounts (not streaming subscribers). Registration, passwords and
// sessions are handled by Clerk; this table mirrors the Clerk user and holds
// the CRM role. New sign-ups start inactive with no role until an admin
// approves them. At least one active ADMIN must always exist (trigger).
export const users = pgTable(
  "users",
  {
    userId: integer().primaryKey().generatedAlwaysAsIdentity(),
    clerkUserId: varchar({ length: 64 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 100 }).notNull(),
    role: userRoleEnum(),
    isActive: boolean().notNull().default(false),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("users_email_lowercase", sql`${t.email} = lower(${t.email})`),
    check("users_name_not_blank", sql`length(trim(${t.name})) > 0`),
    check("users_active_requires_role", sql`NOT ${t.isActive} OR ${t.role} IS NOT NULL`),
  ],
);

// ---------------------------------------------------------------------------
// Relations (for the relational query API)
// ---------------------------------------------------------------------------

export const countriesRelations = relations(countries, ({ many }) => ({
  subscribers: many(subscribers),
  movieLicenses: many(movieLicenses),
}));

export const subscribersRelations = relations(subscribers, ({ one, many }) => ({
  country: one(countries, {
    fields: [subscribers.countryCode],
    references: [countries.countryCode],
  }),
  profiles: many(profiles),
  subscriptions: many(subscriptions),
  payments: many(payments),
  promoCodeRedemptions: many(promoCodeRedemptions),
  campaignTargets: many(campaignTargets),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  subscriber: one(subscribers, {
    fields: [profiles.subscriberId],
    references: [subscribers.subscriberId],
  }),
  watchSessions: many(watchSessions),
  ratings: many(ratings),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  movieGenres: many(movieGenres),
  movieLicenses: many(movieLicenses),
  watchSessions: many(watchSessions),
  ratings: many(ratings),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movieGenres: many(movieGenres),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [payments.subscriberId],
    references: [subscribers.subscriberId],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  promoCodeRedemptions: many(promoCodeRedemptions),
  campaignTargets: many(campaignTargets),
}));

export const promoCodesRelations = relations(promoCodes, ({ many }) => ({
  promoCodeRedemptions: many(promoCodeRedemptions),
}));

export const devicesRelations = relations(devices, ({ many }) => ({
  watchSessions: many(watchSessions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [subscriptions.subscriberId],
    references: [subscribers.subscriberId],
  }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.planId] }),
}));

export const watchSessionsRelations = relations(watchSessions, ({ one }) => ({
  profile: one(profiles, {
    fields: [watchSessions.subscriberId, watchSessions.profileName],
    references: [profiles.subscriberId, profiles.profileName],
  }),
  movie: one(movies, { fields: [watchSessions.movieId], references: [movies.movieId] }),
  device: one(devices, { fields: [watchSessions.deviceId], references: [devices.deviceId] }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  profile: one(profiles, {
    fields: [ratings.subscriberId, ratings.profileName],
    references: [profiles.subscriberId, profiles.profileName],
  }),
  movie: one(movies, { fields: [ratings.movieId], references: [movies.movieId] }),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, { fields: [movieGenres.movieId], references: [movies.movieId] }),
  genre: one(genres, { fields: [movieGenres.genreId], references: [genres.genreId] }),
}));

export const promoCodeRedemptionsRelations = relations(promoCodeRedemptions, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [promoCodeRedemptions.subscriberId],
    references: [subscribers.subscriberId],
  }),
  promoCode: one(promoCodes, {
    fields: [promoCodeRedemptions.code],
    references: [promoCodes.code],
  }),
  campaign: one(campaigns, {
    fields: [promoCodeRedemptions.campaignId],
    references: [campaigns.campaignId],
  }),
}));

export const movieLicensesRelations = relations(movieLicenses, ({ one }) => ({
  movie: one(movies, { fields: [movieLicenses.movieId], references: [movies.movieId] }),
  country: one(countries, {
    fields: [movieLicenses.countryCode],
    references: [countries.countryCode],
  }),
}));

export const campaignTargetsRelations = relations(campaignTargets, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignTargets.campaignId],
    references: [campaigns.campaignId],
  }),
  subscriber: one(subscribers, {
    fields: [campaignTargets.subscriberId],
    references: [subscribers.subscriberId],
  }),
}));
