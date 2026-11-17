"use client";
import { PageError } from "../../../components/page-error";

export default function GenresError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load genres" source="Genres page" error={error} retry={retry} />;
}
