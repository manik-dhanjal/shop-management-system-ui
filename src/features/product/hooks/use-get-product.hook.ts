import { useQuery } from '@tanstack/react-query';
import { ProductApi } from '@shared/api/product.api';
import { useShop } from '@shared/hooks/shop.hook';

// useQuery Hook
export const useGetProduct = (productId: string) => {
	const { activeShop } = useShop();
	return useQuery({
		queryKey: [activeShop._id, 'product', productId],
		queryFn: async () => {
			return ProductApi.getProduct(activeShop._id, productId);
		},
	});
};
