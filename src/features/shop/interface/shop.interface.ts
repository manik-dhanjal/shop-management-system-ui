import { Location } from "@shared/interfaces/location.interface";
import { Image } from "@shared/interfaces/image.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";
import { ShopStatus } from "@shared/enums/shop-status.enum";
import { UserRole } from "@shared/enums/user-role.enum";
import { ContactPerson } from "@features/customer/interface/customer.interface";

export enum ConstitutionOfBusiness {
  PROPRIETORSHIP = "Proprietorship",
  PARTNERSHIP = "Partnership",
  HINDU_UNDIVIDED_FAMILY = "Hindu Undivided Family",
  PRIVATE_LIMITED_COMPANY = "Private Limited Company",
  PUBLIC_LIMITED_COMPANY = "Public Limited Company",
  LLP = "Limited Liability Partnership",
  TRUST = "Trust",
  ASSOCIATION_OR_BOI = "Association of Persons or Body of Individuals",
  LOCAL_AUTHORITY = "Local Authority",
  STATUTORY_BODY = "Statutory Body",
  GOVERNMENT_DEPARTMENT = "Government Department",
  SOCIETY_OR_CLUB = "Society or Club",
  OTHERS = "Others",
}

export interface ShopGstDetails {
  gstin?: string;
  legalName?: string;
  tradeName?: string;
  panCardNumber?: string;
  address?: string;
  state?: string;
  registrationDate?: string;
  status?: string;
  constitutionOfBusiness?: ConstitutionOfBusiness;
  einvoiceApplicable?: boolean;
  natureOfBusiness?: string[];
  verifiedAt?: string;
  username?: string;
  email?: string;
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
