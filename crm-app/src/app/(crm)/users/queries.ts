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

function buildUserConditions(params: ListUsersPageQuery): SQL | undefined {
  return and(
    //gets a case sensitive like and combines them for name and email
    params.query ? or(ilike(users.name, params.query), ilike(users.email, params.query)) : undefined,
    // gets all the same roles as requested
    params.role ? eq(users.role, params.role) : undefined,
    // gets all the same status as requested
    params.status ? eq(users.status, params.status) : undefined,

    //combines all this into one query to return to the user
  );
}

export async function getUserById(userId: string): Promise<UserListEntry | null> {
  const [user] = await db.select(USER_LIST_COLUMNS)
  .from(users)
  .where(eq(users.userId, userId))
  .limit(1);
  return user ?? null;
}

export async function getUsersTotal(params: ListUsersPageQuery): Promise<number> {
  const [row] = await db.select({ total: count() })
  .from(users)
  .where(buildUserConditions(params));
  return row?.total ?? 0;
}

export async function listUsers(params: ListUsersPageQuery): Promise<UserListEntry[]> {
  const direction = params.sortDir === "asc" ? asc : desc;
  const sortColumn = USER_SORT_COLUMNS[params.sortBy];

  return db
    .select(USER_LIST_COLUMNS)
    .from(users)
    .where(buildUserConditions(params))
    .orderBy(asc(isNull(sortColumn)), direction(sortColumn), asc(users.userId))
    .limit(params.pageSize)
    .offset((params.page - 1) * params.pageSize);
}
