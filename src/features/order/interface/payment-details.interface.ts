import { PaymentMethod } from "@shared/enums/payment-method.enum";
import { PaymentStatus } from "@shared/enums/payment-status.enum";

export interface PaymentDetails {
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  amountPaid: number;
  transactionId?: string;
  notes?: string;
  paymentDate: string; // ISO date string
}
