import { PageSkeleton } from "../../../components/page-skeleton";

export default function CampaignsLoading() {
  return <PageSkeleton label="Loading campaigns" tiles={4} rows={8} />;
}
