import { AddProduct } from '../interfaces/product.interface';
import { useQuery } from '@tanstack/react-query';
import { ProductApi } from '@shared/api/product.api';
import { useShop } from '@shared/hooks/shop.hook';

// useQuery Hook
export const usePaginatedProducts = (
	limit: number,
	page: number,
	filter?: Partial<AddProduct>,
	sort?: Record<keyof AddProduct, string>
) => {
	const { activeShop } = useShop();
	return useQuery({
		queryKey: [
			activeShop._id,
			'product',
			'paginated',
			limit,
			page,
			filter,
			sort,
		],
		queryFn: async () => {
			return ProductApi.getPaginatedProducts(
				activeShop._id,
				limit,
				page,
				filter,
				sort
			);
		},
	});
};
