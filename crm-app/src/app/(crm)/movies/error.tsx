"use client";
import { PageError } from "../../../components/page-error";

export default function MoviesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load movies" source="Movies page" error={error} retry={retry} />;
}
