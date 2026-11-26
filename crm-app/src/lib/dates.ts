import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

export type IsoDate = string;

export type DateRange = {
  startDate: IsoDate;
  endDate: IsoDate | null;
};

export function toIsoDate(date: Date): IsoDate {
  return format(date, "yyyy-MM-dd");
}

export function addDaysToIsoDate(isoDate: IsoDate, days: number): IsoDate {
  return toIsoDate(addDays(parseISO(isoDate), days));
}

export function startOfUtcDay(isoDate: IsoDate): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
  return differenceInCalendarDays(parseISO(to), parseISO(from));
}