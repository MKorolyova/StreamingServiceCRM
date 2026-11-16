"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function SignInError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error("Sign-in page failed", { error });
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4">
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>Sign-in is unavailable right now</AlertTitle>
        <AlertDescription>
          We couldn&apos;t load the sign-in form. Try again in a moment.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => retry()}>Try again</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </main>
  );
}
