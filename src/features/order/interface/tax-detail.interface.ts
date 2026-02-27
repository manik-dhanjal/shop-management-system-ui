import { TaxType } from "@shared/enums/tax-type.enum";

export interface TaxDetail {
  type: TaxType;
  rate: number;
  amount: number;
}
