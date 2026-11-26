import { PageSkeleton } from "../../../components/page-skeleton";

export default function DashboardLoading() {
  return <PageSkeleton label="Loading overview" tiles={8} charts={2} />;
}
