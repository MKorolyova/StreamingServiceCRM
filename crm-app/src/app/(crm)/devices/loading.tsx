import { PageSkeleton } from "../../../components/page-skeleton";

export default function DevicesLoading() {
  return <PageSkeleton label="Loading devices" charts={2} rows={6} />;
}
