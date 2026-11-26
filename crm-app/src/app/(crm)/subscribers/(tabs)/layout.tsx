import { PageHeader } from "../../../components/page-header";
import { SubscribersTabs } from "../components/subscribers-tabs";

export default function SubscribersLayout({ children }: LayoutProps<"/subscribers">) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          label="Subscribers"
          title="Everyone who watches"
          description="Accounts with their plan, profiles, viewing and payments. Open an account for its full history."
        />

        <SubscribersTabs />

        {children}
      </div>
    </main>
  );
}
