import { Skeleton } from "@/components/ui/skeleton";

import { ContentSkeleton } from "./content-skeleton";

type PageSkeletonProps = {
  label: string;
  tiles?: number;
  charts?: number;
  rows?: number;
};

export function PageSkeleton({ label, tiles = 0, charts = 0, rows = 0 }: PageSkeletonProps) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16" aria-busy="true" aria-label={label}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-10 w-80 max-w-full sm:h-12" />
          <Skeleton className="mt-4 h-6 w-[32rem] max-w-full" />
        </div>

        <ContentSkeleton tiles={tiles} charts={charts} rows={rows} />
      </div>
    </main>
  );
}
