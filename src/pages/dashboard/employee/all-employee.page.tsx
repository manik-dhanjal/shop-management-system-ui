import React, { useState } from "react";
import { User } from "@features/user/interface/user.interface";
import { useNavigate } from "react-router-dom";
import { useGetPaginatedEmployees } from "@features/employee/hooks/use-get-paginated-employees.hook";
import { Button, CircularProgress } from "@mui/material";
import { Pagination } from "@shared/components/pagination.component";
import { FaUser } from "react-icons/fa6";
import { useAuth } from "@shared/hooks/auth.hooks";
import { IoPencil, IoTrash } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";

const MAX_USERS_ON_SINGLE_PAGE = 10;

function AllEmployeePage() {
  const { activeShop } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [employeeToDelete, setEmployeeToDelete] = useState<
    | (Omit<User, "shopsMeta"> & {
        shopsMeta: { shop: string; roles: string[] }[];
      })
    | null
  >(null);

  const navigate = useNavigate();
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const paginatedEmployees = useGetPaginatedEmployees(
    MAX_USERS_ON_SINGLE_PAGE,
    currentPage
  );
  // const { mutate } = useDeleteProduct();

  const handleEmployeeDelete = async (employeeId: string) => {};

  const handleEmployeeEdit = (employeeId: string) => {
    navigate(`/dashboard/employee/${employeeId}/edit`);
  };

  if (paginatedEmployees.isError) {
    return <div>{paginatedEmployees.error.message}</div>;
  }
  if (paginatedEmployees.isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );

  if (!paginatedEmployees.data) {
    return (
      <div>
        <h2 className="text-2xl mb-6">All Products</h2> <div>Not Found</div>
      </div>
    );
  }
  console.log(paginatedEmployees);
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Employees
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
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Roles</div>
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
              {paginatedEmployees.data.docs.map((employee) => {
                return (
                  <tr key={employee._id}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        {employee.profileImage ? (
                          <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3 rounded-full object-cover object-center overflow-hidden">
                            <img
                              className="w-full h-full"
                              src={employee.profileImage?.url}
                              width="40"
                              height="40"
                              alt={employee.firstName}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 shrink-0 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                            <FaUser className="text-lg text-gray-400 dark:text-gray-500" />
                          </div>
                        )}

                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left">{employee.email}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left text-sm text-green-500">
                        {employee.shopsMeta
                          .find(({ shop }) => shop === activeShop?._id)
                          ?.roles.join(", ")
                          ?.toLocaleUpperCase()}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {employee.createdAt ? (
                        <div className="text-center">
                          {new Date(employee.createdAt).toLocaleDateString()}
                          {" - "}
                          {new Date(employee.createdAt).toLocaleTimeString()}
                        </div>
                      ) : (
                        <div className="text-center">-</div>
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-xl flex justify-center gap-5 text-gray-800 dark:text-gray-100">
                        <button
                          onClick={() => handleEmployeeEdit(employee._id)}
                        >
                          <IoPencil />
                        </button>
                        {/* <button onClick={() => setEmployeeToDelete(employee)}>
                          <IoTrash />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {paginatedEmployees.data.pagination.totalPages > 1 && (
            <Pagination
              activePage={paginatedEmployees.data.pagination.currentPage}
              onChange={handlePageChange}
              totalPages={paginatedEmployees.data.pagination.totalPages}
              maxPageToShow={5}
            />
          )}
          {employeeToDelete && (
            <Modal
              title="Delete Employee"
              onClose={() => setEmployeeToDelete(null)}
            >
              Do you want to delete your Employee: {employeeToDelete.firstName}{" "}
              {employeeToDelete.lastName}
              <div className="flex mt-8 gap-5 justify-end">
                <Button
                  onClick={() => setEmployeeToDelete(null)}
                  color="inherit"
                  variant="contained"
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleEmployeeDelete(employeeToDelete._id)}
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

export default AllEmployeePage;
