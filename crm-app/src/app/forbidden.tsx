import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4">
      <Alert variant="destructive">
        <ShieldAlert />
        <AlertTitle>You don&apos;t have access to this page</AlertTitle>
        <AlertDescription>
          Your role doesn&apos;t include the permission this page needs. Ask an admin to change
          your role if you need access.
        </AlertDescription>
      </Alert>
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        variant="outline"
        className="self-start"
      >
        Back to dashboard
      </Button>
    </main>
  );
}
