export interface Location {
	address: string;
	/** Optional second address line (suite, building, etc.) */
	addressLine2?: string;
	country: string;
	state: string;
	/** 2-digit Indian GST state code (e.g. "27" for Maharashtra). */
	stateCode?: string;
	city: string;
	pinCode: string;
}
