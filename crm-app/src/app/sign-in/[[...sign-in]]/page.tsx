import type { Metadata } from "next";
import Link from "next/link";
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Sign in · Streaming CRM" };

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-4">
      <ClerkLoading>
        <Skeleton className="h-96 w-full" aria-label="Loading sign-in form" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn />
      </ClerkLoaded>
      <Button variant="link" nativeButton={false} render={<Link href="/" />}>
        Back to home
      </Button>
    </main>
  );
}
