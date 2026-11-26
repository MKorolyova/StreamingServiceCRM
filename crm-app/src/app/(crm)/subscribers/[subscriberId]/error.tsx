"use client";

import { PageError } from "../../../../components/page-error";

export default function SubscriberError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load this subscriber" source="Subscriber page" error={error} retry={retry} />;
}
