"use client";
import { PageError } from "../../../components/page-error";

export default function ActivityError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load activity" source="Activity page" error={error} retry={retry} />;
}
