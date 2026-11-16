import { format } from "date-fns";

const integerFormat = new Intl.NumberFormat("en-US");

/** 12480 -> "12,480" */
export function formatCount(value: number): string {
  return integerFormat.format(value);
}

/** 148920 cents in USD -> "$1,489.20" */
export function formatMoney(amountCents: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(amountCents / 100);
  } catch {
    // Unknown currency code in the data: show the raw code instead of failing the page.
    return `${(amountCents / 100).toFixed(2)} ${currencyCode}`;
  }
}

/** 750 minutes -> "12h 30m" */
export function formatWatchTime(minutes: number): string {
  if (minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${formatCount(hours)}h` : `${formatCount(hours)}h ${rest}m`;
}

/** Date -> "5 Mar 2026". Call on the server so every viewer sees the same day. */
export function formatDate(value: Date): string {
  return format(value, "d MMM yyyy");
}

/** "SUPPORT_AGENT" -> "Support agent" */
export function formatEnumLabel(value: string): string {
  const words = value.toLowerCase().replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
