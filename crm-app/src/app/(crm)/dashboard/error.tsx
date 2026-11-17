"use client";
import { PageError } from "../../../components/page-error";

export default function DashboardError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load the overview" source="Dashboard overview" error={error} retry={retry} />;
}
