import { PageSkeleton } from "../../../components/page-skeleton";

export default function ReportsLoading() {
  return <PageSkeleton label="Loading churn and retention" tiles={4} charts={2} />;
}
