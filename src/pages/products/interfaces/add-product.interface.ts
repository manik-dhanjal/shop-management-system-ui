import { Image } from "@shared/interfaces/image.interface";
import { ProductProperty } from "./product-property.interface";

export interface AddProduct {
  name: string;
  description?: string;
  sku: string;
  images: Image[];
  hsn: string;
  brand: string;
  keywords: string[];
  properties: ProductProperty[];
  igstRate: number; //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
  cgstRate: number; //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
  sgstRate: number; //Applicable IGST rate, e.g., 5%, 12%, 18%, 28%
}
