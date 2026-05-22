export interface Location {
  address: string;
  addressLine2?: string;
  country: string;
  state: string;
  /** 2-digit Indian GST state code (e.g. "27" for Maharashtra). */
  stateCode?: string;
  city: string;
  pinCode: string;
  countryRef?: string;
  stateRef?: string;
  cityRef?: string;
}

export interface CountryOption {
  _id: string;
  name: string;
  code: string;
}

export interface StateOption {
  _id: string;
  name: string;
  code: string;
  countryCode: string;
  isUnionTerritory?: boolean;
  gstZone?: string;
}

export interface CityOption {
  _id: string;
  name: string;
  stateCode: string;
  isMajor?: boolean;
  isSez?: boolean;
}

export interface PincodeLookupResult {
  pincode: string;
  city: string;
  state: string;
  stateCode: string;
  isSez?: boolean;
  officeType?: string;
  sezName?: string;
  cityId?: string;
}
