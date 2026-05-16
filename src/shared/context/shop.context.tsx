import { createContext, ReactNode } from 'react';
import { Shop } from '@features/shop/interface/shop.interface';

interface ShopContextType {
	activeShop: Shop;
}
export const ShopContext = createContext<ShopContextType | undefined>(
	undefined
);

export const ShopProvider = ({
	children,
	activeShop,
}: {
	activeShop: Shop;
	children: ReactNode;
}) => {
	return (
		<ShopContext.Provider
			value={{
				activeShop,
			}}
		>
			{children}
		</ShopContext.Provider>
	);
};
