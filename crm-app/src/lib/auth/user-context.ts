import { cache } from "react";
import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import type { User } from "@/types/users";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  return user ?? null;
});

export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return user;
}