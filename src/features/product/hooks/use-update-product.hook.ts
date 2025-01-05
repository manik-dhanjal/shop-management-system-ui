import { useMutation } from '@tanstack/react-query';
import { AddProduct } from '../interfaces/product.interface';
import { ProductApi } from '@shared/api/product.api';
import { queryClient } from '@/main';
import { useNavigate } from 'react-router-dom';
import { useShop } from '@shared/hooks/shop.hook';

export const useUpdateProduct = () => {
	const { activeShop } = useShop();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: ({
			productId,
			productChanges,
		}: {
			productId: string;
			productChanges: Partial<AddProduct>;
		}) => {
			return ProductApi.updateProduct(
				activeShop._id,
				productId,
				productChanges
			);
		},
		onSuccess: (updatedProduct) => {
			queryClient.setQueryData(
				[activeShop._id, 'product', updatedProduct._id],
				updatedProduct
			);
			queryClient.invalidateQueries({
				queryKey: [activeShop._id, 'product', 'paginated'],
			});
			navigate('/dashboard/product/all');
		},
	});
};
