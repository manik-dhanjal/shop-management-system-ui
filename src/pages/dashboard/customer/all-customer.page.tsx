import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { IoPencil, IoTrash, IoSearch } from "react-icons/io5";
import Modal from "@shared/components/hoc/modal.component";
import { Pagination } from "@shared/components/pagination.component";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value.hook";
import { usePaginatedCustomers } from "@features/customer/hooks/use-get-paginated-customers.hook";
import { useCustomerStats } from "@features/customer/hooks/use-customer-stats.hook";
import { useDeleteCustomer } from "@features/customer/hooks/use-delete-customer.hook";
import { CustomerStatus } from "@shared/enums/customer-status.enum";
import { CustomerType } from "@shared/enums/customer-type.enum";
import { CustomerPopulated } from "@features/customer/interface/customer.interface";

const MAX_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const money = (n: number | undefined) =>
  `₹${(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const daysAgo = (iso?: string) => {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

const lastOrderBadge = (days: number | null) => {
  if (days == null)
    return { label: "No orders", color: "bg-gray-100 text-gray-600" };
  if (days <= 30)
    return { label: `${days}d ago`, color: "bg-emerald-100 text-emerald-800" };
  if (days <= 90)
    return { label: `${days}d ago`, color: "bg-amber-100 text-amber-800" };
  return { label: `${days}d ago`, color: "bg-red-100 text-red-700" };
};

const statusBadge = (status?: CustomerStatus) => {
  switch (status) {
    case CustomerStatus.ACTIVE:
      return "bg-emerald-100 text-emerald-800";
    case CustomerStatus.BLOCKED:
      return "bg-red-100 text-red-700";
    case CustomerStatus.INACTIVE:
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AllCustomerPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<CustomerType | "">("");
  const [toDelete, setToDelete] = useState<CustomerPopulated | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const searchPending = searchInput !== debouncedSearch;

  const filter = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (statusFilter) f.status = statusFilter;
    if (typeFilter) f.type = typeFilter;
    return Object.keys(f).length ? f : undefined;
  }, [statusFilter, typeFilter]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = usePaginatedCustomers(
    MAX_PER_PAGE,
    page,
    debouncedSearch || undefined,
    undefined,
    filter,
  );
  const { data: shopStats, isLoading: statsLoading } = useCustomerStats();
  const { mutate: deleteCustomer } = useDeleteCustomer();

  const rows = data?.docs ?? [];

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load customers</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Customers
        </h1>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/customer/add")}
        >
          Add Customer
        </Button>
      </div>

      {/* KPI strip — shop-wide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Customers"
          value={shopStats?.totalCustomers}
          loading={statsLoading}
        />
        <KpiCard
          label="Active"
          value={shopStats?.activeCustomers}
          loading={statsLoading}
        />
        <KpiCard
          label="Outstanding"
          value={shopStats ? money(shopStats.totalOutstanding) : undefined}
          loading={statsLoading}
        />
        <KpiCard
          label="With GSTIN"
          value={shopStats?.withGstin}
          loading={statsLoading}
        />
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 flex flex-wrap gap-3 items-center">
        <TextField
          size="small"
          placeholder="Search name / phone / GSTIN / code"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearch className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment:
                searchPending || (isFetching && !!debouncedSearch) ? (
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
          label="Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as CustomerStatus | "");
            setPage(1);
          }}
          className="min-w-[140px]"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(CustomerStatus).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Type"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as CustomerType | "");
            setPage(1);
          }}
          className="min-w-[140px]"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(CustomerType).map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 relative">
        {isFetching && !isLoading && (
          <LinearProgress
            className="absolute top-0 left-0 right-0 rounded-t-xl"
            sx={{ height: 2 }}
          />
        )}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <CircularProgress />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
                <tr>
                  <th className="p-2 text-left">Code</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">GSTIN / State</th>
                  <th className="p-2 text-right">Orders</th>
                  <th className="p-2 text-right">Lifetime ₹</th>
                  <th className="p-2 text-right">Outstanding</th>
                  <th className="p-2 text-center">Last Order</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {rows.map((c) => {
                  const last = lastOrderBadge(daysAgo(c.stats?.lastOrderAt));
                  return (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                      onClick={() => navigate(`/dashboard/customer/${c._id}`)}
                    >
                      <td className="p-2 font-mono text-xs">
                        {c.customerCode || "—"}
                      </td>
                      <td className="p-2">
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {c.name}
                        </div>
                        {c.legalName && c.legalName !== c.name && (
                          <div className="text-xs text-gray-500">
                            {c.legalName}
                          </div>
                        )}
                      </td>
                      <td className="p-2 text-gray-600 dark:text-gray-300">
                        {c.phone}
                      </td>
                      <td className="p-2 text-xs">
                        {c.gstin ? (
                          <>
                            <div className="font-mono">{c.gstin}</div>
                            {c.billingAddress?.state && (
                              <div className="text-gray-500">
                                {c.billingAddress.state}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {c.stats?.totalOrders ?? 0}
                      </td>
                      <td className="p-2 text-right">
                        {money(c.stats?.totalBilled)}
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={
                            (c.stats?.outstandingBalance ?? 0) > 0
                              ? "text-red-600 font-medium"
                              : "text-gray-500"
                          }
                        >
                          {money(c.stats?.outstandingBalance)}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${last.color}`}
                        >
                          {last.label}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${statusBadge(
                            c.status,
                          )}`}
                        >
                          {c.status ?? "—"}
                        </span>
                      </td>
                      <td className="p-2">
                        <div
                          className="flex justify-center gap-2 text-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              navigate(`/dashboard/customer/${c._id}/edit`)
                            }
                            aria-label="Edit"
                          >
                            <IoPencil />
                          </button>
                          <button
                            onClick={() => setToDelete(c)}
                            aria-label="Delete"
                          >
                            <IoTrash className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data && data.pagination.totalPages > 1 && (
              <Pagination
                activePage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onChange={setPage}
                maxPageToShow={5}
              />
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {toDelete && (
        <Modal title="Delete customer" onClose={() => setToDelete(null)}>
          <div className="space-y-3 text-sm">
            <p>
              {(toDelete.stats?.totalOrders ?? 0) === 0 &&
              (toDelete.stats?.outstandingBalance ?? 0) === 0 ? (
                <>
                  Permanently delete <b>{toDelete.name}</b>? This customer has
                  no orders and zero outstanding — they will be removed
                  entirely.
                </>
              ) : (
                <>
                  Deactivate <b>{toDelete.name}</b>? They have{" "}
                  {toDelete.stats?.totalOrders ?? 0} order(s) and{" "}
                  {money(toDelete.stats?.outstandingBalance)} outstanding. Order
                  history will be preserved.
                </>
              )}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setToDelete(null)} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteCustomer(toDelete._id);
                  setToDelete(null);
                }}
                color="error"
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const KpiCard: React.FC<{
  label: string;
  value?: string | number;
  loading?: boolean;
}> = ({ label, value, loading }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
    <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
      {label}
    </div>
    {loading ? (
      <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
    ) : (
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-1">
        {value ?? "—"}
      </div>
    )}
  </div>
);

export default AllCustomerPage;
export { AllCustomerPage };
