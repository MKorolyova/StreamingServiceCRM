"use client";

import { PageError } from "../../../components/page-error";

export default function UsersError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load users" source="Users page" error={error} retry={retry} />;
}
