import { useEffect, useState } from 'react';
import { Product } from './interfaces/product.interface';
import { IoCube, IoPencil, IoTrash } from 'react-icons/io5';
import { Pagination } from '@shared/components/pagination.component';
import {
	deleteProduct,
	getPaginatedProducts,
} from '@shared/clients/product.client';
import { Pagination as PaginationType } from '@shared/interfaces/pagination.interface';
import Modal from '@shared/hoc/modal.component';
import Button from '@shared/components/button.component';
import { useNavigate } from 'react-router-dom';
import { useGlobalLoading } from '@shared/hoc/global-loading.component';
import { useAlert, AlertSeverity } from '@shared/hoc/alert.component';
import { AxiosError } from 'axios';

const MAX_PRODUCTS_ON_SINGLE_PAGE = 10;

const INITIAL_PAGINATED_PRODUCTS: PaginationType<Product> = {
	docs: [],
	pagination: {
		totalRecords: 0,
		currentPage: 0,
		totalPages: 0,
		nextPage: null,
		prevPage: null,
	},
};
const AllProductPage = () => {
	const [products, setProducts] = useState<PaginationType<Product>>(
		INITIAL_PAGINATED_PRODUCTS
	);
	const [productToDelete, setProductToDelete] = useState<Product | null>(null);
	const navigate = useNavigate();
	const handlePageChange = (newPage: number) => {
		getProducts(newPage);
	};
	const { showLoading, hideLoading } = useGlobalLoading();
	const { addAlert } = useAlert();

	const handleProductDelete = async (productId: string) => {
		showLoading();
		try {
			await deleteProduct(productId);
			setProductToDelete(null);
			addAlert(
				`${productToDelete?.name} product successfully deleted`,
				AlertSeverity.WARNING
			);
			await getProducts(products.pagination.currentPage);
		} catch (error) {
			if (error instanceof AxiosError) {
				addAlert(error.response?.data?.message, AlertSeverity.ERROR);
			} else if (error instanceof Error) {
				addAlert(error.message, AlertSeverity.ERROR);
			} else {
				addAlert(
					'Unknown error occured while deleting product',
					AlertSeverity.ERROR
				);
			}
		}
		hideLoading();
	};

	const handleProductEdit = (productId: string) => {
		navigate(`/product/${productId}/edit`);
	};

	const getProducts = async (page: number) => {
		showLoading();
		try {
			const response = await getPaginatedProducts(
				MAX_PRODUCTS_ON_SINGLE_PAGE,
				page
			);

			setProducts(response);
		} catch (error) {
			if (error instanceof AxiosError) {
				addAlert(error.response?.data?.message, AlertSeverity.ERROR);
			} else if (error instanceof Error) {
				addAlert(error.message, AlertSeverity.ERROR);
			} else {
				addAlert(
					'Unknown error occured while adding product',
					AlertSeverity.ERROR
				);
			}
		}
		hideLoading();
	};
	useEffect(() => {
		getProducts(1);
	}, []);
	if (products.docs.length === 0)
		return (
			<div>
				<h2 className="text-2xl mb-6">All Products</h2>
				<div>Products not found</div>
			</div>
		);
	return (
		<div>
			<h2 className="text-2xl mb-6">All Products</h2>
			<div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-8">
				{/* <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
					<h2 className="font-semibold text-gray-800 dark:text-gray-100">
						Customers
					</h2>
				</header> */}
				<div className="p-3">
					{/* Table */}
					<div className="overflow-x-auto">
						<table className="table-auto w-full">
							{/* Table header */}
							<thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
								<tr>
									<th className="p-2 whitespace-nowrap">
										<div className="font-semibold text-left">Name</div>
									</th>
									<th className="p-2 whitespace-nowrap">
										<div className="font-semibold text-center">Brand</div>
									</th>
									<th className="p-2 whitespace-nowrap">
										<div className="font-semibold text-center">SKU</div>
									</th>
									<th className="p-2 whitespace-nowrap">
										<div className="font-semibold text-center">HSN</div>
									</th>
									<th className="p-2 whitespace-nowrap">
										<div className="font-semibold text-center">Created At</div>
									</th>
									<th className="p-2 whitespace-nowrap">
										<div className="font-semibold text-center">Actions</div>
									</th>
								</tr>
							</thead>
							{/* Table body */}
							<tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
								{products.docs.map((product) => {
									return (
										<tr key={product._id}>
											<td className="p-2 whitespace-nowrap">
												<div className="flex items-center">
													{/* TODO: handle no image */}
													{product.images.length === 0 ? (
														<div className="w-10 h-10 shrink-0 mr-2 sm:mr-3 flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-full">
															<IoCube className="text-xl text-gray-300 dark:text-gray-500" />
														</div>
													) : (
														<div className="w-10 h-10 shrink-0 mr-2 sm:mr-3 rounded-full overflow-hidden">
															<img
																className="object-cover w-full h-full object-center"
																src={product.images[0].url}
																width="40"
																height="40"
																alt={product.images[0].alt}
															/>
														</div>
													)}

													<div className="font-medium text-gray-800 dark:text-gray-100">
														{product.name}
													</div>
												</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-center">{product.brand}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-center">{product.sku}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-center">{product.hsn}</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												{product.createdAt ? (
													<div className="text-center">
														{new Date(product.createdAt).toLocaleDateString()}
														{' - '}
														{new Date(product.createdAt).toLocaleTimeString()}
													</div>
												) : (
													<div className="text-center">-</div>
												)}
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-xl flex justify-center gap-5 text-gray-800 dark:text-gray-100">
													<button
														onClick={() => handleProductEdit(product._id)}
													>
														<IoPencil />
													</button>
													<button onClick={() => setProductToDelete(product)}>
														<IoTrash />
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			{products.pagination.totalPages > 1 && (
				<Pagination
					activePage={products.pagination.currentPage}
					onChange={handlePageChange}
					totalPages={products.pagination.totalPages}
					maxPageToShow={5}
				/>
			)}

			{productToDelete && (
				<Modal title="Delete Product" onClose={() => setProductToDelete(null)}>
					Do you want to delete Product: {productToDelete.name}
					<div className="flex mt-8 gap-5">
						<Button onClick={() => handleProductDelete(productToDelete._id)}>
							Delete
						</Button>
						<Button onClick={() => setProductToDelete(null)}>Cancel</Button>
					</div>
				</Modal>
			)}
		</div>
	);
};
export default AllProductPage;
