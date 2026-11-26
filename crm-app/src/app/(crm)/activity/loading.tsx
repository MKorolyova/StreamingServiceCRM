import { PageSkeleton } from "../../../components/page-skeleton";

export default function ActivityLoading() {
  return <PageSkeleton label="Loading activity" tiles={4} charts={2} />;
}
