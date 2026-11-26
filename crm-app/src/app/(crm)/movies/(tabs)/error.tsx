"use client";
import { ContentError } from "../../../../components/content-error";

export default function MoviesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ContentError title="We couldn't load movies" source="Movies page" error={error} retry={retry} />;
}
