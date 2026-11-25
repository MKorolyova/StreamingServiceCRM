import { PageSkeleton } from "../../../components/page-skeleton";

export default function PaymentsLoading() {
  return <PageSkeleton label="Loading payments" charts={5} rows={8} />;
}
