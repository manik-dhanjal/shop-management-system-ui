import { Image } from "@shared/interfaces/image.interface";
import { ProductProperty } from "./product-property.interface";

export interface Product {
  _id: string;
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
  createdAt: string; // Date string
  updatedAt: string; // Date string
  stock: number; // Total stock across all inventories
  measuringUnit: string; // Default measuring unit for the product (e.g., pcs, kg)
  shop: string; // Shop ID
  __v: number;
}

export interface AddProduct extends Omit<
  Product,
  "_id" | "createdAt" | "updatedAt" | "__v" | "stock" | "shop"
> {
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormType extends Omit<
  Product,
  "_id" | "createdAt" | "updatedAt" | "__v" | "stock" | "shop"
> {}
