"use client";

import { PageError } from "../../../../components/page-error";

export default function MovieError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load this movie" source="Movie page" error={error} retry={retry} />;
}
