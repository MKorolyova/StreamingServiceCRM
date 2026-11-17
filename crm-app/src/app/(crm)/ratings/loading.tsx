import { PageSkeleton } from "../../../components/page-skeleton";

export default function RatingsLoading() {
  return <PageSkeleton label="Loading ratings" charts={2} rows={6} />;
}
