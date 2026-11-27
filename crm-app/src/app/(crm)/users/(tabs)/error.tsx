"use client";

import { ContentError } from "../../../../components/content-error";

export default function UsersError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ContentError title="We couldn't load users" source="Users page" error={error} retry={retry} />;
}
