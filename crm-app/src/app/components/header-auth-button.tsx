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
  return userId ? <SignOutButton className={"cut-corners h-10 px-4 text-[0.95rem]"} /> : <GetStartedLink />;
}

export function HeaderAuthButton() {
  return (
    <Suspense fallback={<GetStartedLink />}>
      <SessionButton />
    </Suspense>
  );
}
