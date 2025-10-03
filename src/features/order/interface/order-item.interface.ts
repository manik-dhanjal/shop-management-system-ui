import { Product } from "@features/product/interfaces/product.interface";
import { TaxDetail } from "./tax-detail.interface";

export interface OrderItem {
  productId: string; // Product ID (MongoDB ObjectId as string)
  quantity: number; // Quantity of the product ordered
  discount?: number; // Discount applied to the product (optional)
  taxableValue: number; // Taxable value after applying discount
  taxes: TaxDetail[]; // List of applicable taxes on the item
  totalPrice: number; // Total amount after applying discount and taxes
}

export interface OrderItemPopulated extends Omit<OrderItem, "productId"> {
  productId: Product;
}
