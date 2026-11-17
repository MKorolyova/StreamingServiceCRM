import { PageSkeleton } from "../../../components/page-skeleton";

export default function GenresLoading() {
  return <PageSkeleton label="Loading genres" charts={1} rows={8} />;
}
