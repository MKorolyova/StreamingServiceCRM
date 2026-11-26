import { type SQL, type SQLWrapper, sql } from "drizzle-orm";

export function shareOf(condition: SQLWrapper): SQL<number | null> {
  return sql<number | null>`avg(${condition}::int)`.mapWith(Number);
}

export function percentOf(amount: SQLWrapper, percent: SQLWrapper): SQL<number | null> {
  return sql<number | null>`(${amount} * ${percent} / 100.0)`.mapWith(Number);
}
