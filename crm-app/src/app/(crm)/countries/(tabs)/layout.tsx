import { PageHeader } from "../../../components/page-header";
import { CountriesTabs } from "../components/countries-tabs";

export default function CountriesLayout({ children }: LayoutProps<"/countries">) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          label="Countries"
          title="Where subscribers are"
          description="Subscribers, revenue and watch time per country, and the plan each country prefers."
        />

        <CountriesTabs />

        {children}
      </div>
    </main>
  );
}
