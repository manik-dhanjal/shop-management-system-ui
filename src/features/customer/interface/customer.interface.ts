import { Location } from "@shared/interfaces/location.interface";
import { Image } from "@shared/interfaces/image.interface";
import { CustomerType } from "@shared/enums/customer-type.enum";
import { CustomerStatus } from "@shared/enums/customer-status.enum";
import { GstRegistrationType } from "@shared/enums/gst-registration-type.enum";
import { PaymentTerms } from "@shared/enums/payment-terms.enum";
import { CustomerSource } from "@shared/enums/customer-source.enum";

export interface ContactPerson {
  name: string;
  designation?: string;
  phone?: string;
  email?: string;
}

export interface CustomerStats {
  totalOrders: number;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  firstOrderAt?: string;
  lastOrderAt?: string;
  avgOrderValue: number;
}

export interface Customer {
  _id: string;

  // identity
  customerCode?: string;
  name: string;
  legalName?: string;
  type?: CustomerType;
  status?: CustomerStatus;

  // contact
  phone: string;
  alternatePhones?: string[];
  email?: string;
  alternateEmails?: string[];
  contactPersonName?: string;
  contactPersonDesignation?: string;
  contactPersons?: ContactPerson[];
  profileImage?: string;

  // GST & tax
  gstRegistrationType?: GstRegistrationType;
  gstin?: string;
  pan?: string;
  placeOfSupplyStateCode?: string;
  taxInvoicePreference?: string;
  reverseChargeApplicable?: boolean;
  isExempt?: boolean;

  // addresses
  billingAddress?: Location;
  shippingAddresses?: Location[];
  defaultShippingAddressIndex?: number;
  /** @deprecated kept for backwards compatibility — use `shippingAddresses`. */
  shippingAddress?: Location;

  // business terms
  creditLimit?: number;
  creditPeriodDays?: number;
  paymentTerms?: PaymentTerms;
  openingBalance?: number;
  discountPercentDefault?: number;
  currency?: string;

  // CRM
  tags?: string[];
  notes?: string;
  birthday?: string;
  anniversary?: string;
  source?: CustomerSource;
  referredByCustomerId?: string;
  loyaltyPoints?: number;

  // stats & audit
  stats?: CustomerStats;
  shop: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CustomerPopulated extends Omit<Customer, "profileImage"> {
  profileImage?: Image;
}

export interface AddCustomer
  extends Omit<
    Customer,
    "_id" | "createdAt" | "updatedAt" | "shop" | "stats" | "isDeleted"
  > {}

export interface CustomerFormTypes extends AddCustomer {}
