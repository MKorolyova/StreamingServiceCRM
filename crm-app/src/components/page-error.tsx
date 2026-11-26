"use client";

import { ContentError } from "./content-error";

type PageErrorProps = {
  title: string;
  source: string;
  error: unknown;
  retry: () => void;
};

export function PageError({ title, source, error, retry }: PageErrorProps) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <ContentError title={title} source={source} error={error} retry={retry} />
    </main>
  );
}
