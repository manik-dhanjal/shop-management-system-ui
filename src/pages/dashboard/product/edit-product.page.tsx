import { ProductFormType } from '@features/product/interfaces/product.interface';
import { omit as _omit } from 'lodash';
import { useUpdateProduct } from '@features/product/hooks/use-update-product.hook';
import { useGetProduct } from '@features/product/hooks/use-get-product.hook';
import { ProductForm } from '@features/product/components/product-form.component';
import { CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export const EditProductPage = () => {
	const { productId } = useParams();
	const navigate = useNavigate();
	console.log(productId);
	if (!productId) {
		navigate('/404');
		return;
	}
	const { mutate } = useUpdateProduct();
	const existingProduct = useGetProduct(productId);
	const handleSave = async (product: ProductFormType) => {
		mutate({
			productId,
			productChanges: product,
		});
	};
	if (existingProduct.isLoading)
		return (
			<div className="flex flex-col gap-5 items-center justify-center">
				<CircularProgress />
				<div>Loading product details...</div>
			</div>
		);
	return (
		<ProductForm
			formTitle="Update Product"
			onSubmit={handleSave}
			initialFormValues={existingProduct.data}
		/>
	);
};
