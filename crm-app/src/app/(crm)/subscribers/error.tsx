"use client";
import { PageError } from "../../../components/page-error";

export default function SubscribersError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load subscribers" source="Subscribers page" error={error} retry={retry} />;
}
