import { Shop } from '@features/shop/interface/shop.interface';
import { Image } from '@shared/interfaces/image.interface';

export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: number;
	profileImage?: Image;
	shopsMeta: ShopMeta[];
	isActive: boolean;
	__v: number;
}

export interface ShopMeta {
	shop: Shop<string>;
	roles: string;
}
