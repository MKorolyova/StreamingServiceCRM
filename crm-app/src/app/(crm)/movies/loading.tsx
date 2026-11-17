import { PageSkeleton } from "../../../components/page-skeleton";

export default function MoviesLoading() {
  return <PageSkeleton label="Loading movies" rows={10} />;
}
