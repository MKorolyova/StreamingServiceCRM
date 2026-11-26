import { PageSkeleton } from "../../../../components/page-skeleton";

export default function MovieLoading() {
  return <PageSkeleton label="Loading this movie" tiles={4} charts={4} />;
}
