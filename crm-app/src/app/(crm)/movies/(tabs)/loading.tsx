import { ContentSkeleton } from "../../../../components/content-skeleton";

export default function MoviesLoading() {
  return (
    <div aria-busy="true" aria-label="Loading movies" className="flex flex-col gap-8">
      <ContentSkeleton rows={8} />
    </div>
  );
}
