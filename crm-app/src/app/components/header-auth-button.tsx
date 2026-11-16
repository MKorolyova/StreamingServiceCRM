import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "./sign-out-button";


function GetStartedLink() {
  return (
    <Button size="lg" className={"cut-corners h-10 px-4 text-[0.95rem]"} nativeButton={false} render={<Link href="/sign-in" />}>
      Get started
    </Button>
  );
}

async function SessionButton() {
  const { userId } = await auth();
  if (!userId) return <GetStartedLink />;

  return (
    <div className="flex items-center gap-2">
      <SignOutButton variant="ghost" className="h-10 px-3 text-[0.95rem] font-normal text-muted-foreground" />
      <Button size="lg" className={"cut-corners h-10 px-4 text-[0.95rem]"} nativeButton={false} render={<Link href="/dashboard" />}>
        Dashboard
      </Button>
    </div>
  );
}

export function HeaderAuthButton() {
  return (
    <Suspense fallback={<GetStartedLink />}>
      <SessionButton />
    </Suspense>
  );
}
