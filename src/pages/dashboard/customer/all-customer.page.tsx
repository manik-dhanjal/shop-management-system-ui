import { useState } from "react";
import { Customer } from "@features/customer/interface/customer.interface";
import { useNavigate } from "react-router-dom";
import { useGetPaginatedCustomers } from "@features/customer/hooks/use-get-paginated-customers.hook";
import { useDeleteCustomer } from "@features/customer/hooks/use-delete-customer.hook";
import { Button, CircularProgress } from "@mui/material";
import { Pagination } from "@shared/components/pagination.component";
import { IoPencil, IoTrash } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";

const MAX_CUSTOMERS_ON_SINGLE_PAGE = 10;

export const AllCustomerPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

  const navigate = useNavigate();
  const paginatedCustomers = useGetPaginatedCustomers(
    MAX_CUSTOMERS_ON_SINGLE_PAGE,
    currentPage,
  );
  const { mutate: deleteCustomer } = useDeleteCustomer();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCustomerDelete = (customerId: string) => {
    deleteCustomer(customerId);
    setCustomerToDelete(null);
  };

  const handleCustomerEdit = (customerId: string) => {
    navigate(`/dashboard/customer/${customerId}/edit`);
  };

  if (paginatedCustomers.isError) {
    return <div>{paginatedCustomers.error.message}</div>;
  }

  if (paginatedCustomers.isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );

  if (!paginatedCustomers.data) {
    return (
      <div>
        <h2 className="text-2xl mb-6">All Customers</h2>
        <div>Not Found</div>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Customers
        </h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Phone</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">GSTIN</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Created At</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {paginatedCustomers.data.docs.map((customer) => (
                <tr key={customer._id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {customer.name}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left text-gray-800 dark:text-gray-100">
                      {customer.phone}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left text-gray-800 dark:text-gray-100">
                      {customer.email ?? "-"}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left text-gray-800 dark:text-gray-100">
                      {customer.gstin ?? "-"}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {customer.createdAt ? (
                      <div className="text-center text-xs">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-center">-</div>
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-xl flex justify-center gap-3 text-gray-800 dark:text-gray-100">
                      <button onClick={() => handleCustomerEdit(customer._id)}>
                        <IoPencil />
                      </button>
                      <button onClick={() => setCustomerToDelete(customer)}>
                        <IoTrash className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedCustomers.data.pagination.totalPages > 1 && (
            <Pagination
              activePage={paginatedCustomers.data.pagination.currentPage}
              onChange={handlePageChange}
              totalPages={paginatedCustomers.data.pagination.totalPages}
              maxPageToShow={5}
            />
          )}
          {customerToDelete && (
            <Modal
              title="Delete Customer"
              onClose={() => setCustomerToDelete(null)}
            >
              Do you want to delete customer: {customerToDelete.name}?
              <div className="flex mt-8 gap-5 justify-end">
                <Button
                  onClick={() => setCustomerToDelete(null)}
                  color="inherit"
                  variant="contained"
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCustomerDelete(customerToDelete._id)}
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
};
