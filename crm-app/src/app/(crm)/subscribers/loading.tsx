import { Skeleton } from "@/components/ui/skeleton";

export default function SubscribersLoading() {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16" aria-busy="true" aria-label="Loading subscribers">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-10 w-80 max-w-full sm:h-12" />
          <Skeleton className="mt-4 h-6 w-[32rem] max-w-full" />
        </div>

        <div className="flex gap-1 border-b border-dashed">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-col border">
          <Skeleton className="h-11 w-full bg-muted/60" />
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex items-center gap-6 border-t border-dashed px-3 py-3.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="hidden h-4 w-24 md:block" />
              <Skeleton className="hidden h-5 w-16 md:block" />
              <Skeleton className="ml-auto hidden h-7 w-24 lg:block" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
