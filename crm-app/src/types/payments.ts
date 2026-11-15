import type { z } from "zod";
import type { paymentStatusEnum, payments } from "@/db/schema";
import type {
  createPaymentSchema,
  paginationPaymentsSchema,
  paymentKeySchema,
} from "@/validators/payments";

export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];
export type Payment = typeof payments.$inferSelect;
export type PaymentKey = z.infer<typeof paymentKeySchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ListPaymentsQuery = z.infer<typeof paginationPaymentsSchema>;
