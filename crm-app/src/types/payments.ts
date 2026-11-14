import type { z } from "zod";
import type { payments } from "@/db/schema";
import type {
  listPaymentsQuerySchema,
  paymentKeySchema,
  paymentStatusSchema,
  recordPaymentSchema,
  refundPaymentSchema,
} from "@/validators/payments";

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type Payment = typeof payments.$inferSelect;
export type PaymentKey = z.infer<typeof paymentKeySchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;
