import { Shop } from './shop.interface';

export interface ShopFormType
	extends Omit<Shop, '_id' | 'createdAt' | 'updatedAt' | '__v'> {}
