import { ResourceType } from '@shared/enums/resource-type.enum';

export interface Image {
	_id: string;
	shop: string;
	alt?: string;
	publicId: string;
	width: number;
	height: number;
	format: string;
	resourceType: ResourceType;
	bytes: number;
	url: string;
	secureUrl: string;
	folder: string;
}
