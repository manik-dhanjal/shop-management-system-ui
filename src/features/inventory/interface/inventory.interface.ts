import { MeasuringUnit } from "@features/product/enum/measuring-unit.enum";
import { Shop } from "@features/shop/interface/shop.interface";

export interface Inventory {
  _id: string;
  purchasePrice: number;
  sellPrice: number;
  currency: string;
  supplier: Shop<string>; // Supplier ID (reference to Shop)
  initialQuantity: number;
  currentQuantity: number;
  measuringUnit: MeasuringUnit;
  invoiceUrl: string;
  purchasedAt: string; // ISO date string
  product: string; // Product ID
  shop: string; // Shop ID
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

export interface InventoryPopulated extends Omit<
  Inventory,
  "supplier" | "shop"
> {
  supplier: Shop<string>;
  shop: Shop<string>;
}

export interface AddInventory extends Omit<
  Inventory,
  "_id" | "createdAt" | "updatedAt" | "__v" | "shop"
> {
  _id?: string;
  shop: string;
  createdAt?: string;
  updatedAt?: string;
}
