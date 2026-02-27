import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { OrderItem, OrderItemPopulated } from "./order-item.interface";
import { BillingDetails } from "./billing-details.interface";
import { PaymentDetails } from "./payment-details.interface";

export interface Order {
  _id: string;
  invoiceId: string;
  customer: string;
  shop: string;
  invoiceType: InvoiceType;
  items: OrderItemPopulated[];
  description?: string;
  billing: BillingDetails;
  payment: PaymentDetails;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
export interface CreateOrder extends Omit<
  Order,
  "_id" | "createdAt" | "updatedAt" | "__v" | "items"
> {
  items: OrderItem[];
}

export interface UpdateOrder extends Partial<CreateOrder> {
  updatedAt?: string;
}
