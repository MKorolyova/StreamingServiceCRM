import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import { PlayMark } from "../app/components/landing-primitives";
import { SignOutButton } from "../app/components/sign-out-button";

export function CrmHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-6 px-5 lg:px-7">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <PlayMark />
          <span className="text-lg font-semibold tracking-tight">Streaming CRM</span>
        </Link>

        <SignOutButton className="cut-corners h-10 px-4 text-[0.95rem]" />
      </div>
      <Separator variant="dashed" />
    </header>
  );
}
