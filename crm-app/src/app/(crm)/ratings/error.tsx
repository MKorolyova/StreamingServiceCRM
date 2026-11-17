"use client";
import { PageError } from "../../../components/page-error";

export default function RatingsError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load ratings" source="Ratings page" error={error} retry={retry} />;
}
