import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPaginatedOrders } from "@features/order/hooks/use-get-paginated-orders.hook";
import { useDeleteOrder } from "@features/order/hooks/use-delete-order.hook";
import { useOrderStats } from "@features/order/hooks/use-order-stats.hook";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value.hook";
import {
  Button,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { Pagination } from "@shared/components/pagination.component";
import { IoPencil, IoTrash, IoPrint, IoSearch } from "react-icons/io5";
import { IoCopy } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";
import { Order } from "@features/order/interface/order.interface";
import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { PaymentStatus } from "@shared/enums/payment-status.enum";

const MAX_ORDERS_ON_SINGLE_PAGE = 10;

const money = (n: number | undefined) =>
  `₹${(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function AllOrdersPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<InvoiceType | "">(
    "",
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    PaymentStatus | ""
  >("");

  const navigate = useNavigate();
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const searchPending = searchInput !== debouncedSearch;

  const filter = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (invoiceTypeFilter) f.invoiceType = invoiceTypeFilter;
    if (paymentStatusFilter) f["payment.status"] = paymentStatusFilter;
    if (debouncedSearch) {
      f.$or = [{ invoiceId: { $regex: debouncedSearch, $options: "i" } }];
    }
    return Object.keys(f).length ? f : undefined;
  }, [invoiceTypeFilter, paymentStatusFilter, debouncedSearch]);

  const paginatedOrders = useGetPaginatedOrders(
    MAX_ORDERS_ON_SINGLE_PAGE,
    currentPage,
    filter as any,
  );
  const orderStats = useOrderStats();
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Orders
        </h1>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/order/add")}
        >
          Add Order
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <KpiCard
          label="Total Orders"
          value={orderStats.data?.totalOrders?.toString()}
          loading={orderStats.isLoading}
        />
        <KpiCard
          label="Total Billed"
          value={
            orderStats.data ? money(orderStats.data.totalBilled) : undefined
          }
          loading={orderStats.isLoading}
        />
        <KpiCard
          label="Total Paid"
          value={orderStats.data ? money(orderStats.data.totalPaid) : undefined}
          loading={orderStats.isLoading}
        />
        <KpiCard
          label="Outstanding"
          value={
            orderStats.data ? money(orderStats.data.outstanding) : undefined
          }
          loading={orderStats.isLoading}
          danger={
            orderStats.data?.outstanding != null &&
            orderStats.data.outstanding > 0
          }
        />
        <KpiCard
          label="Avg. Order"
          value={
            orderStats.data ? money(orderStats.data.avgOrderValue) : undefined
          }
          loading={orderStats.isLoading}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 flex flex-wrap gap-3 items-center">
        <TextField
          size="small"
          placeholder="Search invoice ID"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearch className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: searchPending ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : null,
            },
          }}
          className="min-w-[280px] flex-1"
          sx={{ minWidth: 280, flex: 1 }}
        />
        <TextField
          select
          size="small"
          label="Invoice Type"
          value={invoiceTypeFilter}
          onChange={(e) => {
            setInvoiceTypeFilter(e.target.value as InvoiceType | "");
            setCurrentPage(1);
          }}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
          className="min-w-[180px]"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(InvoiceType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Payment Status"
          value={paymentStatusFilter}
          onChange={(e) => {
            setPaymentStatusFilter(e.target.value as PaymentStatus | "");
            setCurrentPage(1);
          }}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
          className="min-w-[180px]"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(PaymentStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 relative overflow-x-auto">
        {paginatedOrders.isFetching && !paginatedOrders.isLoading && (
          <LinearProgress
            className="absolute top-0 left-0 right-0 rounded-t-xl"
            sx={{ height: 2 }}
          />
        )}
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
                      {typeof order.customer === "object" &&
                      order.customer !== null
                        ? (
                            order.customer as {
                              name?: string;
                              phone?: string;
                            }
                          ).name ||
                          (order.customer as { phone?: string }).phone ||
                          "—"
                        : order.customer || "—"}
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
                      <button
                        onClick={() =>
                          navigate(`/dashboard/order/${order._id}/print`)
                        }
                        aria-label="Print invoice"
                      >
                        <IoPrint />
                      </button>
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
  );
}

const KpiCard: React.FC<{
  label: string;
  value?: string;
  loading?: boolean;
  danger?: boolean;
}> = ({ label, value, loading, danger }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
      {label}
    </div>
    <div
      className={`mt-3 text-2xl font-semibold ${
        danger ? "text-red-600" : "text-gray-900 dark:text-gray-50"
      }`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <CircularProgress size={16} /> Loading
        </span>
      ) : (
        (value ?? "—")
      )}
    </div>
  </div>
);

export default AllOrdersPage;
