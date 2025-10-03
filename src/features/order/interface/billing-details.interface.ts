import { TaxDetail } from "./tax-detail.interface";

export interface BillingDetails {
  subTotal: number; // Subtotal before any discounts
  discounts: number; // Total discounts applied
  taxes?: TaxDetail[]; // List of applicable taxes on the item
  grandTotal: number; // Grand total before rounding off
  roundOff: number; // Round-off adjustment
  finalAmount: number; // Final payable amount after round-off
}
