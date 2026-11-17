"use client";
import { PageError } from "../../../components/page-error";

export default function CampaignsError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load campaigns" source="Campaigns page" error={error} retry={retry} />;
}
