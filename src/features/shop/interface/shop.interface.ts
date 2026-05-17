import { Location } from "@shared/interfaces/location.interface";
import { Image } from "@shared/interfaces/image.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";
import { ShopStatus } from "@shared/enums/shop-status.enum";
import { UserRole } from "@shared/enums/user-role.enum";
import { ContactPerson } from "@features/customer/interface/customer.interface";

export interface ShopGstDetails {
  gstin?: string;
  legalName?: string;
  tradeName?: string;
  address?: string;
  state?: string;
  registrationDate?: string;
  status?: string;
  username?: string;
  email?: string;
  panCardNumber?: string;
}

export interface Shop {
  _id: string;
  name: string;
  kind?: ShopKind;
  status?: ShopStatus;
  description?: string;
  logo?: Image | string;
  currency?: string;
  timezone?: string;
  billingEmail?: string;

  location?: Location;
  gstin?: string; // legacy / convenience — prefer gstDetails.gstin
  gstDetails?: ShopGstDetails;

  phone?: string;
  email?: string;
  alternatePhones?: string[];
  alternateEmails?: string[];
  contactPersonName?: string;
  contactPersonDesignation?: string;
  contactPersons?: ContactPerson[];

  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  /** Populated by GET /shop/:shopId — caller's role(s) on this shop. */
  myRoles?: UserRole[];
}

export interface MyShopRow {
  shop: Shop;
  roles: UserRole[];
  todayStats: {
    orders: number;
    revenue: number;
    receivable: number;
  };
}

export interface MyShopsStats {
  totalShops: number;
  activeShops: number;
  ordersToday: number;
  revenueToday: number;
  outstandingReceivable: number;
  outstandingPayable: number;
}

export interface ShopMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  /** Only the matching shopsMeta entry is returned by the members endpoint. */
  shopsMeta: Array<{ shop: string; roles: UserRole[] }>;
}

export interface InviteMemberPayload {
  email: string;
  roles: UserRole[];
  firstName?: string;
  lastName?: string;
}
