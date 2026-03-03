import { Location } from "@shared/interfaces/location.interface";
import { Image } from "@shared/interfaces/image.interface";

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  profileImage?: string; // string for ID, Image for populated
  shop: string;
  shippingAddress?: Location;
  billingAddress?: Location;
  gstin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPopulated extends Omit<Customer, "profileImage"> {
  profileImage?: Image;
}
export interface AddCustomer extends Omit<
  Customer,
  "_id" | "createdAt" | "updatedAt" | "shop"
> {}

export interface CustomerFormTypes extends AddCustomer {}
