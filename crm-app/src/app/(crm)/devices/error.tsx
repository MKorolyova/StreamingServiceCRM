"use client";
import { PageError } from "../../../components/page-error";

export default function DevicesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load devices" source="Devices page" error={error} retry={retry} />;
}
