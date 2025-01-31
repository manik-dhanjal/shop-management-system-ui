import { Shop } from "@features/shop/interface/shop.interface";
import { Image } from "@shared/interfaces/image.interface";
import { Location } from "@shared/interfaces/location.interface";
export interface AddUser
  extends Omit<
    User,
    "_id" | "__v" | "isActive" | "profileImage" | "createdAt" | "updatedAt"
  > {
  profileImage?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: Location;
  profileImage?: Image;
  shopsMeta: ShopMeta[];
  isActive: boolean;
  createdAt: string; // Date string
  updatedAt: string; // Date string
  __v: number;
}

export interface ShopMeta {
  shop: Shop<string>;
  roles: string[];
}
