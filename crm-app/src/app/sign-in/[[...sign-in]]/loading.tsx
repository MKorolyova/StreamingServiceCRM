import { Skeleton } from "@/components/ui/skeleton";

export default function SignInLoading() {
  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-4"
      aria-busy="true"
      aria-label="Loading sign-in form"
    >
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-8 w-28" />
    </main>
  );
}
