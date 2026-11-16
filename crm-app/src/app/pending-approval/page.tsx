import type { Metadata } from "next";
import Link from "next/link";
import { redirect, unauthorized } from "next/navigation";
import { Hourglass } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isApprovedUser } from "@/lib/auth/user-context";

export const metadata: Metadata = { title: "Waiting for approval · Streaming CRM" };

export default async function PendingApprovalPage() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (isApprovedUser(user)) return redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4">
      <Alert>
        <Hourglass />
        <AlertTitle>Your account is waiting for approval</AlertTitle>
        <AlertDescription>
          You&apos;re signed in as {user.email}, but an admin still needs to approve your account
          and assign you a role. You&apos;ll get access as soon as that&apos;s done.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2">
        <Button render={<Link href="/pending-approval" prefetch={false} />} nativeButton={false}>
          Check again
        </Button>
        <Button render={<Link href="/" />} nativeButton={false} variant="outline">
          Back to home
        </Button>
      </div>
    </main>
  );
}
