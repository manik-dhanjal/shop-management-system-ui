import { TaxDetail } from "./tax-detail.interface";

export interface BillingDetails {
  subTotal: number;
  discounts: number;
  taxes?: TaxDetail[];
  grandTotal: number;
  roundOff: number;
  finalAmount: number;
}
