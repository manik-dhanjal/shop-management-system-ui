import { Shop } from './shop.interface';

export interface ShopFormType
	extends Omit<Shop<string>, '_id' | 'createdAt' | 'updatedAt' | '__v'> {}
