import { PageSkeleton } from "../../../components/page-skeleton";

export default function UsersLoading() {
  return <PageSkeleton label="Loading users" charts={1} rows={6} />;
}
