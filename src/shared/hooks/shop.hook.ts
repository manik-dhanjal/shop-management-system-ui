import { ShopContext } from '@shared/context/shop.context';
import { useContext } from 'react';

export const useShop = () => {
	const context = useContext(ShopContext);
	if (!context) {
		throw new Error('useShop must be used within an ShopProvider');
	}
	return context;
};
