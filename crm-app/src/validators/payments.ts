import { z } from "zod";
import { paymentStatusEnum } from "@/db/schema";
import { 
  uuidSchema,
  paginationSchema,
 } from "./common";


export const paymentKeySchema = z.object({ 
  paymentId: uuidSchema 
});

export const createPaymentSchema = z.object({
  amountCents: z.number("Amount must be a number").int("Amount must be in whole cents").min(1, "Amount must be greater than 0").max(2_147_483_647, "Amount is too large"),
  method: z.string().trim().min(1, "Payment method is required").max(30, "Payment method is too long"),
  status: z.enum(paymentStatusEnum.enumValues, "Invalid payment status"),
  subscriberId: uuidSchema,
});

export const paginationPaymentsSchema = paginationSchema.extend({
  status: z.enum(paymentStatusEnum.enumValues, "Invalid payment status").optional(),
  method: z.string().trim().max(30, "Payment method is too long").optional(),
  subscriberId: uuidSchema.optional(),
})
