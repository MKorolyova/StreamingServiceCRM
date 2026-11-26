import { Skeleton } from "@/components/ui/skeleton";

type ContentSkeletonProps = {
  tiles?: number;
  charts?: number;
  rows?: number;
};

export function ContentSkeleton({ tiles = 0, charts = 0, rows = 0 }: ContentSkeletonProps) {
  return (
    <>
      {tiles > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: tiles }, (_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      )}

      {charts > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: charts }, (_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      )}

      {rows > 0 && (
        <div className="flex flex-col border">
          <Skeleton className="h-11 w-full bg-muted/60" />
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="flex items-center gap-6 border-t border-dashed px-3 py-3.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="hidden h-4 w-24 md:block" />
              <Skeleton className="ml-auto hidden h-4 w-20 lg:block" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
