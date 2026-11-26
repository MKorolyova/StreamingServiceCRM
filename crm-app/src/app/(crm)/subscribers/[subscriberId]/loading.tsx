import { PageSkeleton } from "../../../../components/page-skeleton";

export default function SubscriberLoading() {
  return <PageSkeleton label="Loading this subscriber" tiles={4} charts={2} rows={4} />;
}
