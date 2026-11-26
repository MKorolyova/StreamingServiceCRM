import { Badge } from "@/components/ui/badge";
import { formatEnumLabel } from "@/lib/format";
import type { Payment } from "@/types/payments";

const STATUS_VARIANT: Record<Payment["status"], "default" | "destructive" | "outline"> = {
  PAID: "default",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export function PaymentStatusBadge({ status }: { status: Payment["status"] }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="px-2.5 font-mono text-[0.7rem] font-normal tracking-wider uppercase">
      {formatEnumLabel(status)}
    </Badge>
  );
}
