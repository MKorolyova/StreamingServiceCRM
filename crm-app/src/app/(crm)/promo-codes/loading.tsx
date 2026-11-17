import { PageSkeleton } from "../../../components/page-skeleton";

export default function PromoCodesLoading() {
  return <PageSkeleton label="Loading promo codes" tiles={4} rows={8} />;
}
