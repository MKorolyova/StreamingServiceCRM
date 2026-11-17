"use client";
import { PageError } from "../../../components/page-error";

export default function CountriesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load countries" source="Countries page" error={error} retry={retry} />;
}
