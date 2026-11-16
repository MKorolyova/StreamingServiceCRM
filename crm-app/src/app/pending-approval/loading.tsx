import { Skeleton } from "@/components/ui/skeleton";

export default function PendingApprovalLoading() {
  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4"
      aria-busy="true"
      aria-label="Checking your account"
    >
      <Skeleton className="h-28 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-28" />
      </div>
    </main>
  );
}
