import { type SQL, type SQLWrapper, sql } from "drizzle-orm";

// Date helpers for Drizzle queries. Drizzle has no built-ins for date parts or
// interval maths, so these wrap the Postgres expressions in typed, reusable SQL.

/** Day of the week of a timestamp in UTC: 0 is Monday, 6 is Sunday. */
export function utcWeekdayOf(timestamp: SQLWrapper): SQL<number> {
  return sql<number>`(extract(isodow from ${timestamp} at time zone 'UTC')::int - 1)`.mapWith(Number);
}

/** Hour of the day of a timestamp in UTC, 0 to 23. */
export function utcHourOf(timestamp: SQLWrapper): SQL<number> {
  return sql<number>`extract(hour from ${timestamp} at time zone 'UTC')::int`.mapWith(Number);
}

/** UTC month a timestamp falls in, as YYYY-MM. */
export function utcMonthOf(timestamp: SQLWrapper): SQL<string> {
  return sql<string>`to_char(${timestamp} at time zone 'UTC', 'YYYY-MM')`;
}

/** A timestamp moved forward by a number of minutes taken from a column or expression. */
export function addMinutesTo(timestamp: SQLWrapper, minutes: SQLWrapper): SQL<Date> {
  return sql<Date>`(${timestamp} + make_interval(mins => ${minutes}::int))`;
}

/** A calendar date moved forward by a number of days. */
export function addDaysTo(date: SQLWrapper, days: number): SQL<string> {
  return sql<string>`(${date} + ${days}::int)`;
}

/** Whole days from one calendar date to another; an empty end date counts as today. */
export function daysFromTo(startDate: SQLWrapper, endDate: SQLWrapper): SQL<number> {
  return sql<number>`(coalesce(${endDate}, current_date) - ${startDate})`.mapWith(Number);
}

/** Whole days between two calendar dates, whichever comes first. */
export function daysApart(firstDate: SQLWrapper, secondDate: SQLWrapper): SQL<number> {
  return sql<number>`abs(${firstDate} - ${secondDate})`.mapWith(Number);
}
