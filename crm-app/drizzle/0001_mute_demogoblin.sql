CREATE TYPE "public"."UserStatus" AS ENUM('PENDING', 'APPROVED');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "UserStatus" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isActive";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_matches_status_check" CHECK (("users"."status" = 'APPROVED') = ("users"."role" IS NOT NULL));