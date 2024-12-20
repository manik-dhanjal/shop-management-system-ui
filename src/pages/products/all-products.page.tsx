import { useState } from 'react';
import Image01 from '../../shared/media/images/user-36-05.jpg';
import { Product as ProductType } from './interfaces/product.interface';
import { IoPencil, IoTrash } from 'react-icons/io5';
import { Pagination } from '@shared/components/pagination.component';

const products: ProductType[] = [...Array(10).keys()].map((id) => ({
	_id: `${id}`,
	name: 'Alex Shatov',
	description: 'some random description',
	sku: 'sku' + id,
	images: [
		{
			src: Image01,
			alt: 'image01',
		},
	],
	hsn: 'hsn' + id,
	brand: 'some brand' + id,
	keywords: [],
	properties: [],
	igstRate: 18,
	cgstRate: 9,
	sgstRate: 9,
	createdAt: new Date(),
	updatedAt: new Date(),
}));
const AllProductPage = () => {
	const [activePage, setActivePage] = useState(1);
	const handlePageChange = (newPage: number) => {
		setActivePage(newPage);
	};
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
								{products.map((product) => {
									return (
										<tr key={product._id}>
											<td className="p-2 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
														<img
															className="rounded-full"
															src={product.images[0].src}
															width="40"
															height="40"
															alt={product.images[0].alt}
														/>
													</div>
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
												<div className="text-center">
													{product.createdAt.toLocaleDateString()}
													{' - '}
													{product.createdAt.toLocaleTimeString()}
												</div>
											</td>
											<td className="p-2 whitespace-nowrap">
												<div className="text-xl flex justify-center gap-5 text-gray-800 dark:text-gray-100">
													<button>
														<IoPencil />
													</button>
													<button>
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
			<Pagination
				activePage={activePage}
				onChange={handlePageChange}
				totalPages={20}
				maxPageToShow={5}
			/>
		</div>
	);
};

export default AllProductPage;
