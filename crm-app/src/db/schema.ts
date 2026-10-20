import { 
  relations, 
  sql
} from "drizzle-orm";

import {
  boolean,
  char,
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
  uuid,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";


// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const subscriberStatusEnum = pgEnum("SubscriberStatus", ["ACTIVE", "PAUSED", "CANCELED"]);
export const maturityLevelEnum = pgEnum("MaturityLevel", ["ALL", "AGE_7", "AGE_13", "AGE_16", "AGE_18"]);
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
    subscriberId: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    status: subscriberStatusEnum().notNull().default("ACTIVE"),
    countryCode: char({ length: 2 }).notNull().references(() => countries.countryCode, { onDelete: "restrict" }), // Lives_In
  }
);

// Weak entity
export const profiles = pgTable("profiles", {
    subscriberId: uuid().notNull().references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    profileName: varchar({ length: 50 }).notNull(),
    maturityLevel: maturityLevelEnum().notNull().default("AGE_18"),
    language: varchar({ length: 10 }).notNull().default("en"),
    isDefault: boolean().notNull().default(false),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.profileName] }),
    // At most one default per account; "at least one" is a deferred trigger.
    uniqueIndex("profiles_one_default_per_subscriber_idx").on(t.subscriberId).where(sql`${t.isDefault}`),
  ],
);

export const plans = pgTable("plans", {
    planId: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 50 }).notNull().unique(),
    monthlyPriceCents: integer().notNull(),
    maxStreams: smallint().notNull(),
    maxProfiles: smallint().notNull(),
    resolution: resolutionEnum().notNull(),
  }
);

export const movies = pgTable("movies", {
    movieId: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull(),
    releaseYear: smallint().notNull(),
    runtimeMinutes: smallint().notNull(),
    maturityRating: maturityLevelEnum().notNull(),
  }
);

export const genres = pgTable("genres", {
    genreId: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 50 }).notNull().unique(),
});

export const payments = pgTable("payments", {
    paymentId: uuid().primaryKey().defaultRandom(),
    amountCents: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    method: varchar({ length: 30 }).notNull(),
    status: paymentStatusEnum().notNull(),
    subscriberId: uuid().notNull().references(() => subscribers.subscriberId, { onDelete: "restrict" }),  // Pays
  }
);

export const campaigns = pgTable("campaigns", {
    campaignId: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 100 }).notNull(),
    type: campaignTypeEnum().notNull(),
    startDate: date().notNull(),
    endDate: date().notNull(),
  }
);

export const promoCodes = pgTable("promo_codes", {
    code: varchar({ length: 50 }).primaryKey(),
    discountPercent: smallint().notNull(),
    maxUses: integer().notNull(),
    expiryDate: date().notNull(),
  }
);

export const devices = pgTable("devices", {
    deviceId: uuid().primaryKey().defaultRandom(),
    type: deviceTypeEnum().notNull(),
    os: varchar({ length: 50 }).notNull(),
    model: varchar({ length: 100 }).notNull(),
});

// ---------------------------------------------------------------------------
// Staff users and access control
// ---------------------------------------------------------------------------

export const users = pgTable( "users", {
    userId: uuid().primaryKey().defaultRandom(),
    clerkUserId: varchar({ length: 64 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 100 }).notNull(),
    role: userRoleEnum(),
    isActive: boolean().notNull().default(false),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  }
);

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

export const subscriptions = pgTable("subscriptions", {
    subscriberId: uuid().notNull().references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    planId: uuid().notNull().references(() => plans.planId, { onDelete: "restrict" }),
    startDate: date().notNull(),
    endDate: date(),
    cancelReason: text(),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.planId, t.startDate] }),
    // At most one active plan per subscriber.
    uniqueIndex("subscriptions_one_active_per_subscriber_idx").on(t.subscriberId).where(sql`${t.endDate} IS NULL`),
  ],
);

export const watchSessions = pgTable("watch_sessions", {
    subscriberId: uuid().notNull(),
    profileName: varchar({ length: 50 }).notNull(),
    movieId: uuid().notNull().references(() => movies.movieId, { onDelete: "restrict" }),
    deviceId: uuid().notNull().references(() => devices.deviceId, { onDelete: "restrict" }),
    watchedAt: timestamp({ withTimezone: true }).notNull(),
    minutesWatched: smallint().notNull().default(0),
    completed: boolean().notNull().default(false),
  },
  (t) => [
    primaryKey({columns: [t.subscriberId, t.profileName, t.movieId, t.deviceId, t.watchedAt]}),
    foreignKey({
      columns: [t.subscriberId, t.profileName],
      foreignColumns: [profiles.subscriberId, profiles.profileName],
    }).onDelete("cascade").onUpdate("cascade"),
  ],
);

export const ratings = pgTable("ratings", {
    subscriberId: uuid().notNull(),
    profileName: varchar({ length: 50 }).notNull(),
    movieId: uuid().notNull().references(() => movies.movieId, { onDelete: "restrict" }),
    stars: smallint().notNull(),
    ratedDate: date().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.profileName, t.movieId] }),
    foreignKey({
      columns: [t.subscriberId, t.profileName],
      foreignColumns: [profiles.subscriberId, profiles.profileName],
    }).onDelete("cascade").onUpdate("cascade"),
  ],
);

export const movieGenres = pgTable("movie_genres",{
    movieId: uuid().notNull().references(() => movies.movieId, { onDelete: "cascade" }),
    genreId: uuid().notNull().references(() => genres.genreId, { onDelete: "restrict" }),
  },
  (t) => [
    primaryKey({ columns: [t.movieId, t.genreId] }),
  ],
);

export const promoCodeRedemptions = pgTable("promo_code_redemptions", {
    subscriberId: uuid().notNull().references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    code: varchar({ length: 50 }).notNull().references(() => promoCodes.code, { onDelete: "restrict", onUpdate: "cascade" }),
    campaignId: uuid().notNull().references(() => campaigns.campaignId, { onDelete: "restrict" }),
    redeemedDate: date().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.code] }),
  ],
);

export const movieCertifications = pgTable("movie_certifications", {
    movieId: uuid().notNull().references(() => movies.movieId, { onDelete: "cascade" }),
    countryCode: char({ length: 2 }).notNull().references(() => countries.countryCode, { onDelete: "cascade" }),
    certification: varchar({ length: 10 }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.movieId, t.countryCode] }),
  ],
);

export const campaignTargets = pgTable("campaign_targets", {
    campaignId: uuid().notNull().references(() => campaigns.campaignId, { onDelete: "cascade" }),
    subscriberId: uuid().notNull().references(() => subscribers.subscriberId, { onDelete: "cascade" }),
    sentDate: date().notNull().defaultNow(),
    response: campaignResponseEnum().notNull().default("SENT"),
  },
  (t) => [
    primaryKey({ columns: [t.campaignId, t.subscriberId] }),
  ],
);

// ---------------------------------------------------------------------------
// Drizzle Relations 
// ---------------------------------------------------------------------------

export const countriesRelations = relations(countries, ({ many }) => ({
  subscribers: many(subscribers),
  movieCertifications: many(movieCertifications),
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
  movieCertifications: many(movieCertifications),
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
  plan: one(plans, { 
    fields: [subscriptions.planId], references: [plans.planId] 
  }),
}));

export const watchSessionsRelations = relations(watchSessions, ({ one }) => ({
  profile: one(profiles, {
    fields: [watchSessions.subscriberId, watchSessions.profileName],
    references: [profiles.subscriberId, profiles.profileName],
  }),
  movie: one(movies, { 
    fields: [watchSessions.movieId], references: [movies.movieId] 
  }),
  device: one(devices, { 
    fields: [watchSessions.deviceId], references: [devices.deviceId] 
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  profile: one(profiles, {
    fields: [ratings.subscriberId, ratings.profileName],
    references: [profiles.subscriberId, profiles.profileName],
  }),
  movie: one(movies, { 
    fields: [ratings.movieId], references: [movies.movieId] 
  }),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, { 
    fields: [movieGenres.movieId], references: [movies.movieId] 
  }),
  genre: one(genres, { 
    fields: [movieGenres.genreId], references: [genres.genreId] 
  }),
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

export const movieCertificationsRelations = relations(movieCertifications, ({ one }) => ({
  movie: one(movies, { 
    fields: [movieCertifications.movieId], references: [movies.movieId] 
  }),
  country: one(countries, {
    fields: [movieCertifications.countryCode],
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
