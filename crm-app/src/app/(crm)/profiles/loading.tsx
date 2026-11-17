import { PageSkeleton } from "../../../components/page-skeleton";

export default function ProfilesLoading() {
  return <PageSkeleton label="Loading profiles" tiles={4} charts={2} rows={4} />;
}
