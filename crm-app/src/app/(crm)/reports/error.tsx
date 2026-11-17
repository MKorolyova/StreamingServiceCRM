"use client";
import { PageError } from "../../../components/page-error";

export default function ReportsError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load churn and retention" source="Reports page" error={error} retry={retry} />;
}
