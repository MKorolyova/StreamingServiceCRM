import { PageSkeleton } from "../../../components/page-skeleton";

export default function CountriesLoading() {
  return <PageSkeleton label="Loading countries" charts={2} rows={8} />;
}
