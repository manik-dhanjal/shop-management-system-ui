import { Product } from "@features/product/interfaces/product.interface";
import { TaxDetail } from "./tax-detail.interface";

export interface OrderItem {
  product: string;
  quantity: number;
  discount?: number;
  taxableValue: number;
  taxes: TaxDetail[];
  totalPrice: number;
}

export interface OrderItemPopulated extends Omit<OrderItem, "product"> {
  product: Product;
}
