import { ContentSkeleton } from "../../../../components/content-skeleton";

export default function SubscribersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading subscribers" className="flex flex-col gap-8">
      <ContentSkeleton rows={8} />
    </div>
  );
}
