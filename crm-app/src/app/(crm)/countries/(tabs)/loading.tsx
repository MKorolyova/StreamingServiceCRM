import { ContentSkeleton } from "../../../../components/content-skeleton";

export default function CountriesLoading() {
  return (
    <div aria-busy="true" aria-label="Loading countries" className="flex flex-col gap-8">
      <ContentSkeleton rows={8} />
    </div>
  );
}
