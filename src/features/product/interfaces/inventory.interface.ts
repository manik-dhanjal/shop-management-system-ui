import { Shop } from "@features/shop/interface/shop.interface";

export interface Inventory {
  purchasePrice: number; // Purchase price of the inventory item
  sellPrice: number;
  currency: string; // Currency of the purchase price
  supplier: string; // Supplier ID (reference to Shop)
  quantity: number; // Quantity of the inventory item
  unit: string; // Unit of measurement for the inventory item
  invoiceUrl: string; // Invoice URL for the inventory item
}

export interface InventoryPopulated extends Omit<Inventory, "supplier"> {
  supplier: Shop<string>;
}
