import { Image } from "@shared/interfaces/image.interface";
import { Location } from "@shared/interfaces/location.interface";

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  shop: string;
  email?: string;
  profileImage?: Image;
  shippingAddress?: Location;
  billingAddress: Location;
  gstin?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCustomer
  extends Omit<Customer, "_id" | "__v" | "createdAt" | "updatedAt" | "profileImage"> {
  profileImage?: string;
}

export interface UpdateCustomer extends Partial<CreateCustomer> {}
