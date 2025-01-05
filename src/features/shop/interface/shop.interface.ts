import { Location } from '@shared/interfaces/location.interface';

export interface Shop<SuppliersType> {
	_id: string;
	name: string;
	location: Location;
	gstin?: string;
	suppliers: SuppliersType[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}
