import { useMutation } from '@tanstack/react-query';
import { ProductApi } from '@shared/api/product.api';
import { useShop } from '@shared/hooks/shop.hook';
import { queryClient } from '@/main';

export const useDeleteProduct = () => {
	const { activeShop } = useShop();
	return useMutation({
		mutationFn: (productId: string) => {
			return ProductApi.deleteProduct(activeShop._id, productId);
		},
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: [activeShop._id, 'product', 'paginated'],
			});
		},
	});
};
