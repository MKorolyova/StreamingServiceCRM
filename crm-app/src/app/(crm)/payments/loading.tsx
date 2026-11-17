import { PageSkeleton } from "../../../components/page-skeleton";

export default function PaymentsLoading() {
  return <PageSkeleton label="Loading payments" tiles={4} rows={8} />;
}
