"use client";
import { ContentError } from "../../../../components/content-error";

export default function PromoCodesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ContentError title="We couldn't load promo codes" source="Promo codes page" error={error} retry={retry} />;
}
