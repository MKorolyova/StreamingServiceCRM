import Link from "next/link";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function CrmNotFound() {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-xl">
        <EmptyState
          icon={SearchX}
          title="We couldn't find that"
          description="The record this link points to does not exist, or has been removed since the link was made."
        >
          <Button className="cut-corners mt-2 h-10 px-4" nativeButton={false} render={<Link href="/dashboard" />}>
            Back to the overview
          </Button>
        </EmptyState>
      </div>
    </main>
  );
}
