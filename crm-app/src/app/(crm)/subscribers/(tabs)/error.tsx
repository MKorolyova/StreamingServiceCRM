"use client";
import { ContentError } from "../../../../components/content-error";

export default function SubscribersError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ContentError title="We couldn't load subscribers" source="Subscribers page" error={error} retry={retry} />;
}
