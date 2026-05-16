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
import { usePaginatedSuppliers } from "@features/supplier/hooks/use-get-paginated-suppliers.hook";
import { useSupplierStats } from "@features/supplier/hooks/use-supplier-stats.hook";
import { useDeleteSupplier } from "@features/supplier/hooks/use-delete-supplier.hook";
import { FindSupplierPanel } from "@features/supplier/components/find-supplier.panel";
import { SupplierStatus } from "@shared/enums/supplier-status.enum";
import { ShopKind, ShopKindLabel } from "@shared/enums/shop-kind.enum";
import { Supplier } from "@features/supplier/interface/supplier.interface";

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

const lastPurchaseBadge = (days: number | null) => {
  if (days == null)
    return { label: "No purchases", color: "bg-gray-100 text-gray-600" };
  if (days <= 30)
    return { label: `${days}d ago`, color: "bg-emerald-100 text-emerald-800" };
  if (days <= 90)
    return { label: `${days}d ago`, color: "bg-amber-100 text-amber-800" };
  return { label: `${days}d ago`, color: "bg-red-100 text-red-700" };
};

const statusBadge = (status?: SupplierStatus) => {
  switch (status) {
    case SupplierStatus.ACTIVE:
      return "bg-emerald-100 text-emerald-800";
    case SupplierStatus.BLOCKED:
      return "bg-red-100 text-red-700";
    case SupplierStatus.INACTIVE:
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AllSupplierPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | "">("");
  const [kindFilter, setKindFilter] = useState<ShopKind | "">("");
  const [toDelete, setToDelete] = useState<Supplier | null>(null);
  const [browseOpen, setBrowseOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const searchPending = searchInput !== debouncedSearch;

  const filter = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (statusFilter) f.status = statusFilter;
    if (kindFilter) f.kind = kindFilter;
    return Object.keys(f).length ? f : undefined;
  }, [statusFilter, kindFilter]);

  const { data, isLoading, isFetching, isError } = usePaginatedSuppliers(
    MAX_PER_PAGE,
    page,
    debouncedSearch || undefined,
    undefined,
    filter,
  );
  const { data: shopStats, isLoading: statsLoading } = useSupplierStats();
  const { mutate: deleteSupplier } = useDeleteSupplier();

  const rows = data?.docs ?? [];

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load suppliers</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Suppliers
        </h1>
        <div className="flex gap-2">
          <Button variant="outlined" onClick={() => setBrowseOpen(true)}>
            Browse Suppliers
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/supplier/add")}
          >
            Add Supplier
          </Button>
        </div>
      </div>

      {/* KPI strip — shop-wide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Suppliers"
          value={shopStats?.totalSuppliers}
          loading={statsLoading}
        />
        <KpiCard
          label="Active"
          value={shopStats?.activeSuppliers}
          loading={statsLoading}
        />
        <KpiCard
          label="Outstanding Payable"
          value={shopStats ? money(shopStats.totalPayable) : undefined}
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
              style: { borderRadius: "8px", width: "100%" },
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
            setStatusFilter(e.target.value as SupplierStatus | "");
            setPage(1);
          }}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
          className="min-w-[140px]"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(SupplierStatus).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Kind"
          value={kindFilter}
          onChange={(e) => {
            setKindFilter(e.target.value as ShopKind | "");
            setPage(1);
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
          {Object.values(ShopKind).map((k) => (
            <MenuItem key={k} value={k}>
              {ShopKindLabel[k]}
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
            No suppliers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
                <tr>
                  <th className="p-2 text-left">Code</th>
                  <th className="p-2 text-left">Name (alias)</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">GSTIN / State</th>
                  <th className="p-2 text-right">Orders</th>
                  <th className="p-2 text-right">Lifetime ₹</th>
                  <th className="p-2 text-right">Payable</th>
                  <th className="p-2 text-center">Last Purchase</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {rows.map((s) => {
                  const last = lastPurchaseBadge(
                    daysAgo(s.stats?.lastPurchaseAt),
                  );
                  const gstin = s.shop?.gstDetails?.gstin;
                  return (
                    <tr
                      key={s._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                      onClick={() => navigate(`/dashboard/supplier/${s._id}`)}
                    >
                      <td className="p-2 font-mono text-xs">
                        {s.supplierCode || "—"}
                      </td>
                      <td className="p-2">
                        <div className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
                          {s.shop?.name}
                          {s.shop?.kind !== ShopKind.EXTERNAL_SUPPLIER && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                              LINKED
                            </span>
                          )}
                        </div>
                        {s.alias && (
                          <div className="text-xs text-gray-500">
                            ({s.alias})
                          </div>
                        )}
                      </td>
                      <td className="p-2 text-gray-600 dark:text-gray-300">
                        {s.shop?.phone || s.primaryContact?.phone || "—"}
                      </td>
                      <td className="p-2 text-xs">
                        {gstin ? (
                          <>
                            <div className="font-mono">{gstin}</div>
                            {s.shop?.gstDetails?.state && (
                              <div className="text-gray-500">
                                {s.shop.gstDetails.state}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {s.stats?.totalOrders ?? 0}
                      </td>
                      <td className="p-2 text-right">
                        {money(s.stats?.totalPurchased)}
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={
                            (s.stats?.outstandingPayable ?? 0) > 0
                              ? "text-red-600 font-medium"
                              : "text-gray-500"
                          }
                        >
                          {money(s.stats?.outstandingPayable)}
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
                            s.status,
                          )}`}
                        >
                          {s.status ?? "—"}
                        </span>
                      </td>
                      <td className="p-2">
                        <div
                          className="flex justify-center gap-2 text-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              navigate(`/dashboard/supplier/${s._id}/edit`)
                            }
                            aria-label="Edit"
                          >
                            <IoPencil />
                          </button>
                          <button
                            onClick={() => setToDelete(s)}
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

      {browseOpen && (
        <Modal
          title="Browse Suppliers"
          onClose={() => setBrowseOpen(false)}
          className="w-[95vw] max-w-[1100px]"
          contentClassName="max-h-[80vh] overflow-y-auto"
        >
          <FindSupplierPanel
            onConfirmLink={(s) => {
              setBrowseOpen(false);
              navigate(
                `/dashboard/supplier/add?linkShopId=${encodeURIComponent(s._id)}`,
              );
            }}
          />
        </Modal>
      )}

      {toDelete && (
        <Modal title="Remove supplier" onClose={() => setToDelete(null)}>
          <div className="space-y-3 text-sm">
            <p>
              {(toDelete.stats?.totalOrders ?? 0) === 0 &&
              (toDelete.stats?.outstandingPayable ?? 0) === 0 ? (
                <>
                  Unlink <b>{toDelete.shop?.name}</b>? No purchases recorded and
                  zero outstanding — the link will be removed
                  {toDelete.shop?.kind === ShopKind.EXTERNAL_SUPPLIER
                    ? " (and the external supplier shop too if no other shop references it)."
                    : "."}
                </>
              ) : (
                <>
                  Deactivate <b>{toDelete.shop?.name}</b>? They have{" "}
                  {toDelete.stats?.totalOrders ?? 0} order(s) and{" "}
                  {money(toDelete.stats?.outstandingPayable)} payable. Purchase
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
                  deleteSupplier(toDelete._id);
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

export default AllSupplierPage;
export { AllSupplierPage };
