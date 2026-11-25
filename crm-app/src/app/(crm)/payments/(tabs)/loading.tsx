import { ContentSkeleton } from "../../../../components/content-skeleton";

export default function PaymentsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading payments" className="flex flex-col gap-8">
      <ContentSkeleton rows={8} />
    </div>
  );
}
