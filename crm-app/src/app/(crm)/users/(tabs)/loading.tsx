import { ContentSkeleton } from "../../../../components/content-skeleton";

export default function UsersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading users" className="flex flex-col gap-8">
      <ContentSkeleton rows={8} />
    </div>
  );
}
