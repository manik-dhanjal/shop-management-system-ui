import { ShopFormType } from '@features/shop/interface/shop-form.interface';
import { Shop } from '@features/shop/interface/shop.interface';
import { apiClient } from './client.api';

export class ShopApi {
	static async addShop(shop: ShopFormType): Promise<Shop<string>> {
		const response = await apiClient.post('/api/shop', shop);
		return response.data;
	}
}
