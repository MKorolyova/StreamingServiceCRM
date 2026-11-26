import { format, parseISO } from "date-fns";

const integerFormat = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
  return integerFormat.format(value);
}

export function formatMoney(amountCents: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currencyCode}`;
  }
}

export function formatWatchTime(minutes: number): string {
  if (minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${formatCount(hours)}h` : `${formatCount(hours)}h ${rest}m`;
}

export function formatDate(value: Date): string {
  return format(value, "d MMM yyyy");
}

export function formatEnumLabel(value: string): string {
  const words = value.toLowerCase().replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function formatPercent(ratio: number | null, fractionDigits = 1): string {
  if (ratio === null || Number.isNaN(ratio)) return "—";
  return `${(ratio * 100).toFixed(fractionDigits)}%`;
}

export function formatDateOnly(value: string): string {
  return format(parseISO(value), "d MMM yyyy");
}

export function formatDuration(days: number): string {
  const whole = Math.max(Math.round(days), 0);
  if (whole < 30) return `${whole}d`;
  const years = Math.floor(whole / 365);
  const months = Math.floor((whole % 365) / 30);
  if (years === 0) return whole % 30 === 0 ? `${months}mo` : `${months}mo ${whole % 30}d`;
  return months === 0 ? `${years}y` : `${years}y ${months}mo`;
}

export function formatStars(value: number | null): string {
  return value === null ? "—" : value.toFixed(1);
}
