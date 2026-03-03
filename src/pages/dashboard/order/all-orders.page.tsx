import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@shared/components/form/button.component";

export const AllOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            All Orders
          </h1>
        </div>
        <div>
          <Button onClick={() => navigate("/dashboard/order/add")}>
            New Order
          </Button>
        </div>
      </div>
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
                <tr>
                  <th className="p-2">
                    <div className="font-semibold text-left">Invoice ID</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-center">Customer</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-center">Date</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-center">
                      Total Amount
                    </div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-center">
                      Payment Status
                    </div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-right">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-400 dark:text-gray-500"
                  >
                    No orders found. Create your first order.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
