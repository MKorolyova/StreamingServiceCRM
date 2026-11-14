import { z } from "zod";
import { paymentStatusEnum } from "@/db/schema";
import { dateRangeQuerySchema, listQuerySchema, uuidSchema } from "./common";

export const paymentStatusSchema = z.enum(paymentStatusEnum.enumValues, "Invalid payment status");

export const paymentKeySchema = z.object({ paymentId: uuidSchema });

// Payments are an append-only ledger: recorded once, then only refunded.
export const recordPaymentSchema = z.object({
  amountCents: z.number("Amount must be a number").int("Amount must be in whole cents").min(1, "Amount must be greater than 0").max(2_147_483_647, "Amount is too large"),
  method: z.string().trim().min(1, "Payment method is required").max(30, "Payment method is too long"),
  status: paymentStatusSchema,
  subscriberId: uuidSchema,
});

export const refundPaymentSchema = paymentKeySchema;

export const listPaymentsQuerySchema = listQuerySchema(["createdAt", "amountCents", "status"])
  .extend({
    status: paymentStatusSchema.optional(),
    subscriberId: uuidSchema.optional(),
  })
  .and(dateRangeQuerySchema);
