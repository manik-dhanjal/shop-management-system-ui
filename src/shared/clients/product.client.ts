import {
	AddProduct,
	Product,
} from '@pages/products/interfaces/product.interface';
import { Pagination } from '@shared/interfaces/pagination.interface';
import axios from 'axios';
import { omit as _omit } from 'lodash';
const baseUrl =
	'http://localhost:3001/api/shop/6765bae37ab3095322389127/product';

export const createProduct = async (product: AddProduct): Promise<Product> => {
	const response = await axios.post(baseUrl, {
		...product,
		images: product.images.map((image) => image._id),
	});
	return response.data;
};

export const getPaginatedProducts = async (
	limit: number,
	page: number,
	filter?: Partial<AddProduct>,
	sort?: Record<keyof AddProduct, string>
): Promise<Pagination<Product>> => {
	const response = await axios.post(`${baseUrl}/paginated`, {
		limit,
		page,
		filter,
		sort,
	});
	return response.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
	await axios.delete(`${baseUrl}/${productId}`);
};

export const getProduct = async (productId: string): Promise<Product> => {
	const response = await axios.get(`${baseUrl}/${productId}`);
	return response.data;
};

export const updateProduct = async (
	productId: string,
	product: Partial<Product>
): Promise<Product> => {
	let productPayload: Partial<Omit<Product, 'images'> & { images: string[] }>;
	if (product.images) {
		productPayload = {
			...product,
			images: product.images.map((image) => image._id),
		};
	} else {
		productPayload = _omit(product, ['images']);
	}
	const response = await axios.patch(`${baseUrl}/${productId}`, productPayload);
	return response.data;
};
