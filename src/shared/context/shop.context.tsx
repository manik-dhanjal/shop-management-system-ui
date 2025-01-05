import { createContext, ReactNode } from 'react';
import { Shop } from '@features/shop/interface/shop.interface';

interface ShopContextType {
	activeShop: Shop<string>;
}
export const ShopContext = createContext<ShopContextType | undefined>(
	undefined
);

export const ShopProvider = ({
	children,
	activeShop,
}: {
	activeShop: Shop<string>;
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
