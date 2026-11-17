"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type PageErrorProps = {
  title: string;
  source: string;
  error: unknown;
  retry: () => void;
};

export function PageError({ title, source, error, retry }: PageErrorProps) {
  useEffect(() => { console.error(`${source} failed`, { error }) }, [source, error]);

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            Something went wrong while loading this page. Your data is safe; try again in a moment.
          </AlertDescription>
        </Alert>
        <Button onClick={() => retry()} className="cut-corners h-10 self-start px-4">
          Try again
        </Button>
      </div>
    </main>
  );
}
