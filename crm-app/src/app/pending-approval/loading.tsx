import { Skeleton } from "@/components/ui/skeleton";

export default function PendingApprovalLoading() {
  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-4"
      aria-busy="true"
      aria-label="Checking your account"
    >
      <div className="flex flex-col gap-4 border p-6">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-6 w-72 max-w-full" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </main>
  );
}
