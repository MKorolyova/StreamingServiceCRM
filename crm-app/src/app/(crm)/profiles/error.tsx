"use client";
import { PageError } from "../../../components/page-error";

export default function ProfilesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load profiles" source="Profiles page" error={error} retry={retry} />;
}
