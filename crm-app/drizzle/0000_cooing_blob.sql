CREATE TYPE "public"."CampaignResponse" AS ENUM('SENT', 'OPENED', 'CLICKED', 'REDEEMED', 'IGNORED');--> statement-breakpoint
CREATE TYPE "public"."CampaignType" AS ENUM('PROMO', 'WIN_BACK', 'NEW_RELEASE');--> statement-breakpoint
CREATE TYPE "public"."DeviceType" AS ENUM('TV', 'PHONE', 'TABLET', 'BROWSER');--> statement-breakpoint
CREATE TYPE "public"."MaturityLevel" AS ENUM('ALL', 'AGE_7', 'AGE_13', 'AGE_16', 'AGE_18');--> statement-breakpoint
CREATE TYPE "public"."PaymentStatus" AS ENUM('PAID', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."Resolution" AS ENUM('SD', 'HD', 'FULL_HD', 'ULTRA_HD');--> statement-breakpoint
CREATE TYPE "public"."SubscriberStatus" AS ENUM('ACTIVE', 'PAUSED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('ADMIN', 'SUPPORT_AGENT', 'BILLING', 'MARKETING', 'CONTENT_MANAGER', 'ANALYST');--> statement-breakpoint
CREATE TABLE "campaign_targets" (
	"campaignId" uuid NOT NULL,
	"subscriberId" uuid NOT NULL,
	"sentDate" date DEFAULT now() NOT NULL,
	"response" "CampaignResponse" DEFAULT 'SENT' NOT NULL,
	CONSTRAINT "campaign_targets_campaignId_subscriberId_pk" PRIMARY KEY("campaignId","subscriberId")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"campaignId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "CampaignType" NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"countryCode" char(2) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"currencyCode" char(3) NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"deviceId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "DeviceType" NOT NULL,
	"os" varchar(50) NOT NULL,
	"model" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"genreId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "movie_certifications" (
	"movieId" uuid NOT NULL,
	"countryCode" char(2) NOT NULL,
	"certification" varchar(10) NOT NULL,
	CONSTRAINT "movie_certifications_movieId_countryCode_pk" PRIMARY KEY("movieId","countryCode")
);
--> statement-breakpoint
CREATE TABLE "movie_genres" (
	"movieId" uuid NOT NULL,
	"genreId" uuid NOT NULL,
	CONSTRAINT "movie_genres_movieId_genreId_pk" PRIMARY KEY("movieId","genreId")
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"movieId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"releaseYear" smallint NOT NULL,
	"runtimeMinutes" smallint NOT NULL,
	"maturityRating" "MaturityLevel" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"paymentId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amountCents" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"method" varchar(30) NOT NULL,
	"status" "PaymentStatus" NOT NULL,
	"subscriberId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"planId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"monthlyPriceCents" integer NOT NULL,
	"maxStreams" smallint NOT NULL,
	"maxProfiles" smallint NOT NULL,
	"resolution" "Resolution" NOT NULL,
	CONSTRAINT "plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"subscriberId" uuid NOT NULL,
	"profileName" varchar(50) NOT NULL,
	"maturityLevel" "MaturityLevel" DEFAULT 'AGE_18' NOT NULL,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	CONSTRAINT "profiles_subscriberId_profileName_pk" PRIMARY KEY("subscriberId","profileName")
);
--> statement-breakpoint
CREATE TABLE "promo_code_redemptions" (
	"subscriberId" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"campaignId" uuid NOT NULL,
	"redeemedDate" date DEFAULT now() NOT NULL,
	CONSTRAINT "promo_code_redemptions_subscriberId_code_pk" PRIMARY KEY("subscriberId","code")
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"code" varchar(50) PRIMARY KEY NOT NULL,
	"discountPercent" smallint NOT NULL,
	"maxUses" integer NOT NULL,
	"expiryDate" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"subscriberId" uuid NOT NULL,
	"profileName" varchar(50) NOT NULL,
	"movieId" uuid NOT NULL,
	"stars" smallint NOT NULL,
	"ratedDate" date DEFAULT now() NOT NULL,
	CONSTRAINT "ratings_subscriberId_profileName_movieId_pk" PRIMARY KEY("subscriberId","profileName","movieId")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"subscriberId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "SubscriberStatus" DEFAULT 'ACTIVE' NOT NULL,
	"countryCode" char(2) NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"subscriberId" uuid NOT NULL,
	"planId" uuid NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date,
	"cancelReason" text,
	CONSTRAINT "subscriptions_subscriberId_planId_startDate_pk" PRIMARY KEY("subscriberId","planId","startDate")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkUserId" varchar(64) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" "UserRole",
	"isActive" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerkUserId_unique" UNIQUE("clerkUserId"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "watch_sessions" (
	"subscriberId" uuid NOT NULL,
	"profileName" varchar(50) NOT NULL,
	"movieId" uuid NOT NULL,
	"deviceId" uuid NOT NULL,
	"watchedAt" timestamp with time zone NOT NULL,
	"minutesWatched" smallint DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "watch_sessions_subscriberId_profileName_movieId_deviceId_watchedAt_pk" PRIMARY KEY("subscriberId","profileName","movieId","deviceId","watchedAt")
);
--> statement-breakpoint
ALTER TABLE "campaign_targets" ADD CONSTRAINT "campaign_targets_campaignId_campaigns_campaignId_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("campaignId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_targets" ADD CONSTRAINT "campaign_targets_subscriberId_subscribers_subscriberId_fk" FOREIGN KEY ("subscriberId") REFERENCES "public"."subscribers"("subscriberId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_certifications" ADD CONSTRAINT "movie_certifications_movieId_movies_movieId_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("movieId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_certifications" ADD CONSTRAINT "movie_certifications_countryCode_countries_countryCode_fk" FOREIGN KEY ("countryCode") REFERENCES "public"."countries"("countryCode") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movieId_movies_movieId_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("movieId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genreId_genres_genreId_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genres"("genreId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriberId_subscribers_subscriberId_fk" FOREIGN KEY ("subscriberId") REFERENCES "public"."subscribers"("subscriberId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_subscriberId_subscribers_subscriberId_fk" FOREIGN KEY ("subscriberId") REFERENCES "public"."subscribers"("subscriberId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promo_code_redemptions" ADD CONSTRAINT "promo_code_redemptions_subscriberId_subscribers_subscriberId_fk" FOREIGN KEY ("subscriberId") REFERENCES "public"."subscribers"("subscriberId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promo_code_redemptions" ADD CONSTRAINT "promo_code_redemptions_code_promo_codes_code_fk" FOREIGN KEY ("code") REFERENCES "public"."promo_codes"("code") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "promo_code_redemptions" ADD CONSTRAINT "promo_code_redemptions_campaignId_campaigns_campaignId_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("campaignId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_movieId_movies_movieId_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("movieId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_subscriberId_profileName_profiles_subscriberId_profileName_fk" FOREIGN KEY ("subscriberId","profileName") REFERENCES "public"."profiles"("subscriberId","profileName") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_countryCode_countries_countryCode_fk" FOREIGN KEY ("countryCode") REFERENCES "public"."countries"("countryCode") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscriberId_subscribers_subscriberId_fk" FOREIGN KEY ("subscriberId") REFERENCES "public"."subscribers"("subscriberId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_plans_planId_fk" FOREIGN KEY ("planId") REFERENCES "public"."plans"("planId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_sessions" ADD CONSTRAINT "watch_sessions_movieId_movies_movieId_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("movieId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_sessions" ADD CONSTRAINT "watch_sessions_deviceId_devices_deviceId_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."devices"("deviceId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_sessions" ADD CONSTRAINT "watch_sessions_subscriberId_profileName_profiles_subscriberId_profileName_fk" FOREIGN KEY ("subscriberId","profileName") REFERENCES "public"."profiles"("subscriberId","profileName") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_one_default_per_subscriber_idx" ON "profiles" USING btree ("subscriberId") WHERE "profiles"."isDefault";--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_one_active_per_subscriber_idx" ON "subscriptions" USING btree ("subscriberId") WHERE "subscriptions"."endDate" IS NULL;