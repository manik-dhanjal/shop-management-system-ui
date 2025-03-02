import { useState } from "react";
import { Product } from "../../../features/product/interfaces/product.interface";
import { IoCube, IoPencil, IoTrash } from "react-icons/io5";
import { Pagination } from "@shared/components/pagination.component";
import { Pagination as PaginationType } from "@shared/interfaces/pagination.interface";
import Modal from "@shared/components/hoc/modal.component";
import Button from "@shared/components/form/button.component";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@shared/context/alert.context";
import { usePaginatedProducts } from "@features/product/hooks/use-get-paginated-products.hook";
import { useDeleteProduct } from "@features/product/hooks/use-delete-product.hook";
import { CircularProgress } from "@mui/material";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const navigate = useNavigate();
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const paginatedProducts = usePaginatedProducts(
    MAX_PRODUCTS_ON_SINGLE_PAGE,
    currentPage
  );
  const { mutate } = useDeleteProduct();

  const handleProductDelete = async (productId: string) => {
    mutate(productId);
  };

  const handleProductEdit = (productId: string) => {
    navigate(`/dashboard/product/${productId}/edit`);
  };

  if (paginatedProducts.isError) {
    return <div>{paginatedProducts.error.message}</div>;
  }
  if (paginatedProducts.isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );

  if (!paginatedProducts.data) {
    return (
      <div>
        <h2 className="text-2xl mb-6">All Products</h2> <div>Not Found</div>
      </div>
    );
  }
  console.log(paginatedProducts.data);
  return (
    <div>
      <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mb-6">
        View Products
      </h1>
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-8">
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
                {paginatedProducts.data.docs.map((product) => {
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
                            {" - "}
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
      {paginatedProducts.data.pagination.totalPages > 1 && (
        <Pagination
          activePage={paginatedProducts.data.pagination.currentPage}
          onChange={handlePageChange}
          totalPages={paginatedProducts.data.pagination.totalPages}
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
