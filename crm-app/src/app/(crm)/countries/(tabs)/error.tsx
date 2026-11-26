"use client";
import { ContentError } from "../../../../components/content-error";

export default function CountriesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ContentError title="We couldn't load countries" source="Countries page" error={error} retry={retry} />;
}
