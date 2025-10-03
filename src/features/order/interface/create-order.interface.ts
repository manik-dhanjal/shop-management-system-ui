import { InvoiceType } from "../enum/invoice-type.enum";
import { BillingDetails } from "./billing-details.interface";
import { OrderItem, OrderItemPopulated } from "./order-item.interface";
import { PaymentDetails } from "./payment-details.interface";

export interface CreateOrder {
  invoiceId: string; // Unique Invoice number
  customer: string; // Customer ID (MongoDB ObjectId as string)
  billedBy: string; // ID of the person who billed the order
  shop: string; // Shop ID (MongoDB ObjectId as string)
  invoiceType: InvoiceType; // Type of invoice (enum)
  items: OrderItem[]; // List of order items
  description?: string; // Optional additional order description
  billing: BillingDetails; // Billing details (taxes, discounts, final amount)
  payment: PaymentDetails; // Payment details for the order
  createdAt: Date; // Order placement date and time
}

export interface CreateOrderPopulated extends Omit<CreateOrder, "items"> {
  items: OrderItemPopulated[];
}
