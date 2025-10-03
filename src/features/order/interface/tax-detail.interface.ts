import { TaxType } from "../enum/tax-type.enum";

export interface TaxDetail {
  type: TaxType; // Type of tax applied (e.g., CGST, SGST, IGST)
  rate: number; // Tax rate percentage
  amount: number; // Tax amount calculated
}
