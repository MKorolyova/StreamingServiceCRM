import { PageHeader } from "../../../components/page-header";
import { PaymentsTabs } from "../components/payments-tabs";

export default function PaymentsLayout({ children }: LayoutProps<"/payments">) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          label="Payments"
          title="Money in, money missing"
          description="Every payment, and what each plan brings in per country."
        />

        <PaymentsTabs />

        {children}
      </div>
    </main>
  );
}
