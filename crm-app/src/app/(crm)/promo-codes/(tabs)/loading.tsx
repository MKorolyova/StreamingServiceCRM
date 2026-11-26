import { ContentSkeleton } from "../../../../components/content-skeleton";

export default function PromoCodesLoading() {
  return (
    <div aria-busy="true" aria-label="Loading promo codes" className="flex flex-col gap-8">
      <ContentSkeleton tiles={4} rows={8} />
    </div>
  );
}
