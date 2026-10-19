import Link from "next/link";
import { LogIn } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4">
      <Alert>
        <LogIn />
        <AlertTitle>Sign in required</AlertTitle>
        <AlertDescription>
          You&apos;re not signed in, or your account is still waiting for an admin to approve it
          and assign a role.
        </AlertDescription>
      </Alert>
      <Button render={<Link href="/sign-in" />} nativeButton={false} className="self-start">
        Sign in
      </Button>
    </main>
  );
}
