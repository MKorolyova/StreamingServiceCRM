"use client";
import { PageError } from "../../../components/page-error";

export default function PromoCodesError({ error, retry }: { error: unknown; retry: () => void }) {
  return <PageError title="We couldn't load promo codes" source="Promo codes page" error={error} retry={retry} />;
}
