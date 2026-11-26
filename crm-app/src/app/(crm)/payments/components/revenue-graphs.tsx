import { LIST_PRICE_CURRENCY } from "@/constants/constants";
import { formatCount, formatMoney } from "@/lib/format";

import { BarList } from "../../../../components/bar-list";
import { ChartCard } from "../../../../components/chart-card";
import { SectionHeading } from "../../../components/page-header";
import { listRevenueByPlanAndCountry } from "../queries";

const TOP_COUNTRIES = 8;
const NO_PLAN_LABEL = "No plan";

type CountryRevenue = {
  countryName: string;
  paidPayments: number;
  revenueCents: number;
};

type RevenueGraphProps = {
  title: string;
  countries: CountryRevenue[];
  max?: number;
  className?: string;
};

function RevenueGraph({ title, countries, max, className }: RevenueGraphProps) {
  const revenueCents = countries.reduce((sum, country) => sum + country.revenueCents, 0);
  const paidPayments = countries.reduce((sum, country) => sum + country.paidPayments, 0);

  return (
    <ChartCard
      title={`${title}: ${formatMoney(revenueCents, LIST_PRICE_CURRENCY)}`}
      description={
        countries.length > TOP_COUNTRIES
          ? `${formatCount(paidPayments)} paid payments. Top ${TOP_COUNTRIES} of ${formatCount(countries.length)} countries.`
          : `${formatCount(paidPayments)} paid payments.`
      }
      isEmpty={countries.length === 0}
      emptyDescription="No paid payments yet."
      className={className}
    >
      <BarList
        max={max}
        entries={countries.slice(0, TOP_COUNTRIES).map((country) => ({
          label: country.countryName,
          value: country.revenueCents,
          display: formatMoney(country.revenueCents, LIST_PRICE_CURRENCY),
          note: `${formatCount(country.paidPayments)} ${country.paidPayments === 1 ? "payment" : "payments"}`,
        }))}
      />
    </ChartCard>
  );
}

function sortByRevenue(countries: CountryRevenue[]): CountryRevenue[] {
  return countries.toSorted((a, b) => b.revenueCents - a.revenueCents || a.countryName.localeCompare(b.countryName));
}

export async function RevenueGraphs() {
  const revenue = await listRevenueByPlanAndCountry();
  const planMax = Math.max(0, ...revenue.map((entry) => entry.revenueCents));

  const plans = Array.from(Map.groupBy(revenue, (entry) => entry.planName ?? NO_PLAN_LABEL), ([planName, entries]) => ({
    planName,
    countries: sortByRevenue(entries),
  })).sort((a, b) => a.planName.localeCompare(b.planName));

  const total = Array.from(Map.groupBy(revenue, (entry) => entry.countryName), ([countryName, entries]) => ({
    countryName,
    paidPayments: entries.reduce((sum, entry) => sum + entry.paidPayments, 0),
    revenueCents: entries.reduce((sum, entry) => sum + entry.revenueCents, 0),
  }));

  return (
    <section aria-labelledby="revenue-heading" className="flex flex-col gap-4">
      <SectionHeading
        id="revenue-heading"
        title="Revenue by plan and country"
        description={`Paid payments by the plan the subscriber was on when they paid, at list price in ${LIST_PRICE_CURRENCY}. The plan graphs share one scale.`}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => (
          <RevenueGraph key={plan.planName} title={plan.planName} countries={plan.countries} max={planMax} />
        ))}
        <RevenueGraph title="Total" countries={sortByRevenue(total)} className="lg:col-span-2" />
      </div>
    </section>
  );
}
