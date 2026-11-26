"use client";
import { ContentError } from "../../../../components/content-error";

export default function PaymentsError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ContentError title="We couldn't load payments" source="Payments page" error={error} retry={retry} />;
}
