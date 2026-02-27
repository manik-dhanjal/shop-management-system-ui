import { useState } from "react";
import { Order } from "@features/order/interface/order.interface";
import { useNavigate } from "react-router-dom";
import { useGetPaginatedOrders } from "@features/order/hooks/use-get-paginated-orders.hook";
import { useDeleteOrder } from "@features/order/hooks/use-delete-order.hook";
import { Button, CircularProgress } from "@mui/material";
import { Pagination } from "@shared/components/pagination.component";
import { IoPencil, IoTrash } from "react-icons/io5";
import { IoCopy } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";

const MAX_ORDERS_ON_SINGLE_PAGE = 10;

function AllOrdersPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const navigate = useNavigate();
  const paginatedOrders = useGetPaginatedOrders(
    MAX_ORDERS_ON_SINGLE_PAGE,
    currentPage,
  );
  const { mutate: deleteOrder } = useDeleteOrder();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOrderDelete = async (orderId: string) => {
    deleteOrder(orderId);
    setOrderToDelete(null);
  };

  const handleOrderEdit = (orderId: string) => {
    navigate(`/dashboard/order/${orderId}/edit`);
  };

  const handleOrderDuplicate = (orderId: string) => {
    navigate(`/dashboard/order/add?duplicate=${orderId}`);
  };

  if (paginatedOrders.isError) {
    return <div>{paginatedOrders.error.message}</div>;
  }

  if (paginatedOrders.isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );

  if (!paginatedOrders.data) {
    return (
      <div>
        <h2 className="text-2xl mb-6">All Orders</h2>
        <div>Not Found</div>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Orders
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Invoice ID</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Customer</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Type</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Amount</div>
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
              {paginatedOrders.data.docs.map((order) => {
                return (
                  <tr key={order._id}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {order.invoiceId}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left text-gray-800 dark:text-gray-100">
                        {order.customer}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left text-sm text-blue-500">
                        {order.invoiceType}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left text-gray-800 dark:text-gray-100">
                        ₹{order.billing.finalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {order.createdAt ? (
                        <div className="text-center text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-center">-</div>
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-xl flex justify-center gap-3 text-gray-800 dark:text-gray-100">
                        <button onClick={() => handleOrderEdit(order._id)}>
                          <IoPencil />
                        </button>
                        <button onClick={() => handleOrderDuplicate(order._id)}>
                          <IoCopy />
                        </button>
                        <button onClick={() => setOrderToDelete(order)}>
                          <IoTrash className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {paginatedOrders.data.pagination.totalPages > 1 && (
            <Pagination
              activePage={paginatedOrders.data.pagination.currentPage}
              onChange={handlePageChange}
              totalPages={paginatedOrders.data.pagination.totalPages}
              maxPageToShow={5}
            />
          )}
          {orderToDelete && (
            <Modal title="Delete Order" onClose={() => setOrderToDelete(null)}>
              Do you want to delete order: {orderToDelete.invoiceId}?
              <div className="flex mt-8 gap-5 justify-end">
                <Button
                  onClick={() => setOrderToDelete(null)}
                  color="inherit"
                  variant="contained"
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleOrderDelete(orderToDelete._id)}
                  color="error"
                  variant="contained"
                  size="small"
                >
                  Delete
                </Button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllOrdersPage;
