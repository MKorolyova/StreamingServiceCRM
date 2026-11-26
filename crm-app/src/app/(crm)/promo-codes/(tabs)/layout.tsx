import { PageHeader } from "../../../components/page-header";
import { PromoCodesTabs } from "../components/promo-codes-tabs";

export default function PromoCodesLayout({ children }: LayoutProps<"/promo-codes">) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          label="Promo codes"
          title="Discounts and what they cost"
          description="How far each code is into its uses, when it expires and the revenue it has given away."
        />

        <PromoCodesTabs />

        {children}
      </div>
    </main>
  );
}
