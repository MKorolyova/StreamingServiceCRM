import { and, asc, count, desc, eq, ilike, isNull, or, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { db } from "@/db";
import { users } from "@/db/schema";
import type { User } from "@/types/users";

import type { ListUsersPageQuery } from "./validators";

const USER_SORT_COLUMNS: Record<ListUsersPageQuery["sortBy"], PgColumn> = {
  name: users.name,
  role: users.role,
  created: users.createdAt,
  updated: users.updatedAt,
};

/** The columns the users page shows. The Clerk id stays on the server. */
const USER_LIST_COLUMNS = {
  userId: users.userId,
  name: users.name,
  email: users.email,
  role: users.role,
  status: users.status,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export type UserListEntry = Pick<User, "userId" | "name" | "email" | "role" | "status" | "createdAt" | "updatedAt">;

/** Escapes LIKE wildcards so a search for "50%" matches the text, not everything. */
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function buildUserConditions(params: ListUsersPageQuery): SQL | undefined {
  const pattern = params.query ? `%${escapeLikePattern(params.query)}%` : null;

  return and(
    pattern ? or(ilike(users.name, pattern), ilike(users.email, pattern)) : undefined,
    params.role ? eq(users.role, params.role) : undefined,
    params.status ? eq(users.status, params.status) : undefined,
  );
}

export async function getUserById(userId: string): Promise<UserListEntry | null> {
  const [user] = await db.select(USER_LIST_COLUMNS).from(users).where(eq(users.userId, userId)).limit(1);
  return user ?? null;
}

export async function getUsersTotal(params: ListUsersPageQuery): Promise<number> {
  const [row] = await db.select({ total: count() }).from(users).where(buildUserConditions(params));
  return row?.total ?? 0;
}

export async function listUsers(params: ListUsersPageQuery): Promise<UserListEntry[]> {
  const direction = params.sortDir === "asc" ? asc : desc;
  const sortColumn = USER_SORT_COLUMNS[params.sortBy];

  return db
    .select(USER_LIST_COLUMNS)
    .from(users)
    .where(buildUserConditions(params))
    // Users without a role (still pending) stay at the end in both directions.
    .orderBy(asc(isNull(sortColumn)), direction(sortColumn), asc(users.userId))
    .limit(params.pageSize)
    .offset((params.page - 1) * params.pageSize);
}
