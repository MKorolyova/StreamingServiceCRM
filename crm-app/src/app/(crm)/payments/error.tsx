"use client";
import { PageError } from "../../../components/page-error";

export default function PaymentsError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load payments" source="Payments page" error={error} retry={retry} />;
}
