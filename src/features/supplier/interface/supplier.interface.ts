import { Location } from "@shared/interfaces/location.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";
import { SupplierStatus } from "@shared/enums/supplier-status.enum";
import { PaymentTerms } from "@shared/enums/payment-terms.enum";
import { ContactPerson } from "@features/customer/interface/customer.interface";

export interface SupplierStats {
  totalOrders: number;
  totalPurchased: number;
  totalPaid: number;
  outstandingPayable: number;
  firstPurchaseAt?: string;
  lastPurchaseAt?: string;
  avgOrderValue: number;
}

export interface SupplierShop {
  _id: string;
  name: string;
  kind: ShopKind;
  location?: Location;
  phone?: string;
  email?: string;
  alternatePhones?: string[];
  alternateEmails?: string[];
  contactPersonName?: string;
  contactPersonDesignation?: string;
  contactPersons?: ContactPerson[];
  gstDetails?: {
    gstin?: string;
    legalName?: string;
    tradeName?: string;
    state?: string;
    panCardNumber?: string;
  };
  isDeleted?: boolean;
}

export interface PrimaryContact {
  name?: string;
  phone?: string;
  email?: string;
}

/** Shape of a single row returned by the paginated/get endpoints. */
export interface Supplier {
  _id: string;
  supplierShop: string;
  supplierCode?: string;
  alias?: string;
  status: SupplierStatus;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  creditPeriodDays: number;
  openingBalance: number;
  defaultDiscountPct: number;
  tags: string[];
  notes?: string;
  primaryContact?: PrimaryContact;
  stats: SupplierStats;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  /** Populated supplier shop joined from `shops` collection. */
  shop: SupplierShop;
}

/** Body for creating a supplier link. Either link or create-and-link. */
export interface AddSupplier {
  supplierShopId?: string;
  newShop?: SupplierShopFormTypes;
  supplierCode?: string;
  alias?: string;
  status?: SupplierStatus;
  paymentTerms?: PaymentTerms;
  creditLimit?: number;
  creditPeriodDays?: number;
  openingBalance?: number;
  defaultDiscountPct?: number;
  tags?: string[];
  notes?: string;
  primaryContact?: PrimaryContact;
}

/** Editable fields on the underlying supplier Shop (external suppliers only). */
export interface SupplierShopFormTypes {
  name: string;
  location?: Location;
  gstDetails?: SupplierShop["gstDetails"];
  phone?: string;
  email?: string;
  alternatePhones?: string[];
  alternateEmails?: string[];
  contactPersonName?: string;
  contactPersonDesignation?: string;
  contactPersons?: ContactPerson[];
}

/** Aggregate form: link-meta + (optional) external-shop-meta. */
export interface SupplierFormTypes extends AddSupplier {}

export interface SupplierShopLookup {
  _id: string;
  name: string;
  kind: ShopKind;
  phone?: string;
  email?: string;
  gstDetails?: { gstin?: string; legalName?: string };
  location?: Location;
  /** How many shops have linked this shop as their supplier. */
  linkedByCount?: number;
  /** True when the buyer already has this shop linked. */
  alreadyLinked?: boolean;
}

export interface ShopLookupQuery {
  q?: string;
  state?: string;
  city?: string;
  kind?: ShopKind | "";
  gstStatus?: "any" | "registered" | "unregistered";
  sort?: "popular" | "name" | "recent" | "nearest";
  cursor?: string;
  limit?: number;
}

export interface ShopLookupResponse {
  docs: SupplierShopLookup[];
  nextCursor: string | null;
}

export interface SupplierSuggestions {
  popularInYourState: SupplierShopLookup[];
  popularOverall: SupplierShopLookup[];
  recentlyAdded: SupplierShopLookup[];
}

export interface ShopPreview extends SupplierShop {
  linkedByCount: number;
  alreadyLinked: boolean;
}
