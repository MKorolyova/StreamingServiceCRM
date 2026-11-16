import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import type { User } from "@/types/users";
import { createUserSchema } from "@/validators/users";

/**
 * Saves the signed-in Clerk account as a row in `users` the first time we see
 * it. The row starts as PENDING with no role, waiting for an admin to approve
 * it. Returns null when the account cannot be saved.
 */
export async function createUserFromClerk(clerkUserId: string): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== clerkUserId) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress;
  const name = clerkUser.fullName?.trim() || clerkUser.username || email?.split("@")[0];

  const parsed = createUserSchema.safeParse({ clerkUserId, email, name: name?.slice(0, 100) });
  if (!parsed.success) {
    console.error("Clerk account cannot be saved as a user", {
      clerkUserId,
      issues: parsed.error.issues.map((issue) => issue.path.join(".")),
    });
    return null;
  }

  // Two requests can arrive at once right after sign-up; only one insert wins.
  const [created] = await db.insert(users).values(parsed.data).onConflictDoNothing().returning();
  if (created) {
    console.info("User created from Clerk account", { userId: created.userId, clerkUserId });
    return created;
  }

  const [existing] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (!existing) {
    // The insert was skipped, but not by this account: its email belongs to another user row.
    console.error("Clerk account email is already used by another user", { clerkUserId });
  }
  return existing ?? null;
}
