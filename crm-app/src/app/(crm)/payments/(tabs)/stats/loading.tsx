import { ContentSkeleton } from "../../../../../components/content-skeleton";

export default function PaymentStatsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading payment stats" className="flex flex-col gap-8">
      <ContentSkeleton charts={4} />
    </div>
  );
}
