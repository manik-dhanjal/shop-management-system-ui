import { Location } from '@shared/interfaces/location.interface';

export interface Shop {
	_id: string;
	name: string;
	location: Location;
	gstin?: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
