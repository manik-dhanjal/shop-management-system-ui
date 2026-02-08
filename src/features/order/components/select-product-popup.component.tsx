import { Button, CircularProgress, Modal } from "@mui/material";
import { IoChevronDown, IoClose } from "react-icons/io5";
import ProductSearchBar from "./product-search-bar.component";
import { useState } from "react";
import { ProductCard } from "./product-card.component";
import { CategoryCard } from "./category-card.component";
import { usePaginatedProducts } from "@features/product/hooks/use-get-paginated-products.hook";
import { Pagination } from "@shared/components/pagination.component";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { Product } from "@features/product/interfaces/product.interface";

const MAX_PRODUCTS_ON_SINGLE_PAGE = 25;

interface SelectProductPopupProps {
  open: boolean;
  handleClose: () => void;
  onOrderItemsChange: (newList: OrderItemPopulated[]) => void;
  orderItems: OrderItemPopulated[];
}

// Dummy category data
const dummyCategories = Array.from({ length: 10 }, (_, index) => ({
  name: `Category ${index + 1}`,
  description: `Description of Category ${index + 1}.`,
}));

const SelectProductPopup = ({
  open,
  handleClose,
  onOrderItemsChange,
  orderItems,
}: SelectProductPopupProps) => {
  const [isCategoriesCollapsed, setIsCategoriesCollapsed] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const toggleCategories = () => {
    setIsCategoriesCollapsed((prev) => !prev);
  };

  const paginatedProducts = usePaginatedProducts(
    MAX_PRODUCTS_ON_SINGLE_PAGE,
    currentPage,
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleProductQtyChange = (product: Product, quantity: number) => {
    if (quantity === 0) {
      const updatedOrderItems = orderItems.filter(
        (orderItem) => orderItem.productId._id !== product._id,
      );

      onOrderItemsChange(updatedOrderItems);
    } else {
      let itemAlreadyExist = false;
      const updatedOrderItems = orderItems.map((orderItem) => {
        if (product._id === orderItem.productId._id) {
          itemAlreadyExist = true;
          return {
            ...orderItem,
            quantity,
            // taxableValue: product.sellPrice * quantity,
            taxableValue: 0,
            taxes: [],
            // totalPrice: product.inventory[0].sellPrice * quantity,
            totalPrice: 0,
          };
        } else {
          return orderItem;
        }
      });

      if (!itemAlreadyExist) {
        updatedOrderItems.push({
          productId: product,
          quantity,
          // taxableValue: product.inventory[0].sellPrice * quantity,
          taxableValue: 0,
          taxes: [],
          // totalPrice: product.inventory[0].sellPrice * quantity,
          totalPrice: 0,
        });
      }

      onOrderItemsChange(updatedOrderItems);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex items-center justify-center h-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-[90vw] h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center ">
            <h2 className="text-lg dark:text-white">Select Products</h2>
            <button
              className="dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-700 "
              onClick={handleClose}
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>
          <hr className="dark:border-gray-600 mt-3" />

          {/* Body */}
          <div className="mt-4 flex-grow">
            <div className="mb-5">
              <ProductSearchBar />
            </div>
            {/* Categories */}
            <div className="mt-4 mb-3">
              <div
                className="flex items-center cursor-pointer mb-3 gap-3"
                onClick={toggleCategories}
              >
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase ">
                  Categories
                </div>
                <div
                  className={`text-gray-600 dark:text-gray-200 transform transition-transform ${
                    isCategoriesCollapsed ? "rotate-180" : ""
                  }`}
                >
                  <IoChevronDown className="w-4 h-4" />
                </div>
              </div>
              {!isCategoriesCollapsed && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                  {dummyCategories.map((category, index) => (
                    <CategoryCard
                      key={index}
                      name={category.name}
                      description={category.description}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product */}
            <div className="max-h-full">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase mb-3">
                Products
              </div>

              {paginatedProducts.isLoading && (
                <div className="w-full h-screen flex items-center justify-center">
                  <CircularProgress />
                </div>
              )}

              {paginatedProducts.data ? (
                <>
                  <div
                    className="overflow-y-auto scrollbar scrollbar scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
                    style={{
                      maxHeight: isCategoriesCollapsed
                        ? "calc(90vh - 261px)"
                        : "calc(90vh - 379px)",
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {paginatedProducts.data.docs.map((product, index) => (
                        <ProductCard
                          key={index}
                          product={product}
                          handleQtyChange={handleProductQtyChange}
                          quantity={
                            orderItems.find(
                              (orderItem) =>
                                orderItem.productId._id === product._id,
                            )?.quantity || 0
                          }
                        />
                      ))}
                    </div>
                    {paginatedProducts.data.pagination.totalPages > 1 && (
                      <Pagination
                        activePage={
                          paginatedProducts.data.pagination.currentPage
                        }
                        onChange={handlePageChange}
                        totalPages={
                          paginatedProducts.data.pagination.totalPages
                        }
                        maxPageToShow={5}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-2xl mb-6">All Products</h2>{" "}
                  <div>Not Found</div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <hr className="dark:border-gray-600" />
          <div className="flex justify-end mt-4">
            <Button variant="contained" onClick={handleClose}>
              Add Selected Products
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectProductPopup;
