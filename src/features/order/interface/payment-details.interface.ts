import { PaymentMethod } from "../enum/payment-method.enum";
import { PaymentStatus } from "../enum/payment-status.enum";

export interface PaymentDetails {
  paymentMethod: PaymentMethod; // Payment method used for the order
  status: PaymentStatus; // Payment status of the order
  amountPaid: number; // Total amount paid
  transactionId?: string; // Transaction ID if payment was made online (optional)
  notes?: string; // Any additional payment notes (optional)
  paymentDate: Date; // Date and time of payment
}
