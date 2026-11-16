"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function PendingApprovalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Pending approval page failed", { error });
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4">
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>We couldn&apos;t check your account</AlertTitle>
        <AlertDescription>
          Something went wrong while loading your approval status. Try again in a moment.
        </AlertDescription>
      </Alert>
      <Button onClick={() => retry()} className="self-start">
        Try again
      </Button>
    </main>
  );
}
