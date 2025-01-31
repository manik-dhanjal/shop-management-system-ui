import { Shop } from "@features/shop/interface/shop.interface";
import { Image } from "@shared/interfaces/image.interface";
export interface AddUser
  extends Omit<User, "_id" | "__v" | "isActive" | "profileImage"> {
  profileImage?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: Image;
  shopsMeta: ShopMeta[];
  isActive: boolean;
  __v: number;
}

export interface ShopMeta {
  shop: Shop<string>;
  roles: string;
}
