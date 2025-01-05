import { useMutation } from '@tanstack/react-query';
import { AddProduct } from '../interfaces/product.interface';
import { ProductApi } from '@shared/api/product.api';
import { queryClient } from '@/main';
import { useNavigate } from 'react-router-dom';
import { useShop } from '@shared/hooks/shop.hook';
import { AlertSeverity, useAlert } from '@shared/context/alert.context';

export const useAddProduct = () => {
	const { activeShop } = useShop();
	const { addAlert } = useAlert();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: (newProduct: AddProduct) => {
			return ProductApi.createProduct(activeShop._id, newProduct);
		},
		onSuccess: (addedProduct) => {
			queryClient.setQueryData(
				[activeShop._id, 'product', addedProduct._id],
				addedProduct
			);
			queryClient.invalidateQueries({
				queryKey: [activeShop._id, 'product', 'paginated'],
			});
			addAlert(
				`${addedProduct.name} product successfully added 🥳`,
				AlertSeverity.SUCCESS
			);
			navigate('/dashboard/product/all');
		},
	});
};
