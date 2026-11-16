import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16" aria-busy="true" aria-label="Loading overview">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-6 h-10 w-96 max-w-full sm:h-12" />
          <Skeleton className="mt-4 h-6 w-[32rem] max-w-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      </div>
    </main>
  );
}
