import { type SQL, type SQLWrapper, sql } from "drizzle-orm";

export function utcWeekdayOf(timestamp: SQLWrapper): SQL<number> {
  return sql<number>`(extract(isodow from ${timestamp} at time zone 'UTC')::int - 1)`.mapWith(Number);
}

export function utcHourOf(timestamp: SQLWrapper): SQL<number> {
  return sql<number>`extract(hour from ${timestamp} at time zone 'UTC')::int`.mapWith(Number);
}

export function addMinutesTo(timestamp: SQLWrapper, minutes: SQLWrapper): SQL<Date> {
  return sql<Date>`(${timestamp} + make_interval(mins => ${minutes}::int))`;
}

export function addDaysTo(date: SQLWrapper, days: number): SQL<string> {
  return sql<string>`(${date} + ${days}::int)`;
}

export function daysFromTo(startDate: SQLWrapper, endDate: SQLWrapper): SQL<number> {
  return sql<number>`(coalesce(${endDate}, current_date) - ${startDate})`.mapWith(Number);
}

export function daysApart(firstDate: SQLWrapper, secondDate: SQLWrapper): SQL<number> {
  return sql<number>`abs(${firstDate} - ${secondDate})`.mapWith(Number);
}
