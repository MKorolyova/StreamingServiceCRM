import { ChartNoAxesColumn } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { formatEnumLabel } from "@/lib/format";

import { getSubscriberBreakdown, type BreakdownEntry } from "../queries";
import { SubscriberBreakdown, type BreakdownChart } from "./subscriber-breakdown";

const MAX_COUNTRIES = 10;

const DEVICE_LABELS: Record<string, string> = {
  TV: "TV",
  PHONE: "Phone",
  TABLET: "Tablet",
  BROWSER: "Browser",
};

/** Keeps the largest countries and folds the long tail into one "Other" bar. */
function foldSmallCountries(entries: BreakdownEntry[]): BreakdownEntry[] {
  if (entries.length <= MAX_COUNTRIES) return entries;

  const rest = entries.slice(MAX_COUNTRIES - 1);
  return [
    ...entries.slice(0, MAX_COUNTRIES - 1),
    {
      label: `Other (${rest.length})`,
      subscribers: rest.reduce((sum, entry) => sum + entry.subscribers, 0),
      profiles: rest.reduce((sum, entry) => sum + entry.profiles, 0),
    },
  ];
}

export async function SubscriberBreakdownTab() {
  const breakdown = await getSubscriberBreakdown();

  const hasSubscribers = breakdown.statuses.some((entry) => entry.subscribers > 0);
  if (!hasSubscribers) {
    return (
      <EmptyState
        icon={ChartNoAxesColumn}
        title="Nothing to break down yet"
        description="The charts fill in as soon as the first subscribers are created."
      />
    );
  }

  const charts: BreakdownChart[] = [
    {
      title: "Countries",
      description: {
        subscribers: "Subscribers by the country they live in",
        profiles: "Profiles by the country of their subscriber",
      },
      entries: foldSmallCountries(breakdown.countries),
    },
    {
      title: "Plans",
      description: {
        subscribers: "Subscribers on each plan right now",
        profiles: "Profiles of the subscribers on each plan right now",
      },
      entries: breakdown.plans,
    },
    {
      title: "Devices",
      description: {
        subscribers: "Subscribers who have watched on each device type",
        profiles: "Profiles that have watched on each device type",
      },
      entries: breakdown.devices.map((entry) => ({ ...entry, label: DEVICE_LABELS[entry.label] ?? entry.label })),
    },
    {
      title: "Status",
      description: {
        subscribers: "Subscribers by account status",
        profiles: "Profiles by the status of their subscriber",
      },
      entries: breakdown.statuses.map((entry) => ({ ...entry, label: formatEnumLabel(entry.label) })),
    },
  ];

  return <SubscriberBreakdown charts={charts} />;
}
