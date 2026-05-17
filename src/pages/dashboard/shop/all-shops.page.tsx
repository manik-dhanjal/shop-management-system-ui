import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value.hook";
import { useMyShops } from "@features/shop/hooks/use-my-shops.hook";
import { useMyShopsStats } from "@features/shop/hooks/use-my-shops-stats.hook";
import { ShopCard } from "@features/shop/components/shop-card.component";
import { UserRole, UserRoleLabel } from "@shared/enums/user-role.enum";
import { ShopKind, ShopKindLabel } from "@shared/enums/shop-kind.enum";
import { ShopStatus } from "@shared/enums/shop-status.enum";

const SEARCH_DEBOUNCE_MS = 400;

const money = (n: number | undefined) =>
  `₹${(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const AllShopsPage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [kindFilter, setKindFilter] = useState<ShopKind | "">("");
  const [statusFilter, setStatusFilter] = useState<ShopStatus | "">("");
  const [stateFilter, setStateFilter] = useState("");

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const searchPending = searchInput !== debouncedSearch;

  const { data: rows = [], isLoading, isFetching } = useMyShops(
    debouncedSearch || undefined,
  );
  const { data: stats, isLoading: statsLoading } = useMyShopsStats();

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (roleFilter && !r.roles.includes(roleFilter)) return false;
        if (kindFilter && r.shop.kind !== kindFilter) return false;
        if (statusFilter && r.shop.status !== statusFilter) return false;
        if (
          stateFilter &&
          (r.shop.location?.state ?? "").toLowerCase() !==
            stateFilter.toLowerCase()
        )
          return false;
        return true;
      }),
    [rows, roleFilter, kindFilter, statusFilter, stateFilter],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          My Shops
        </h1>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/shop/add")}
        >
          Add Shop
        </Button>
      </div>

      {/* Cross-shop KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Kpi label="Total Shops" value={stats?.totalShops} loading={statsLoading} />
        <Kpi label="Active" value={stats?.activeShops} loading={statsLoading} />
        <Kpi
          label="Orders Today"
          value={stats?.ordersToday}
          loading={statsLoading}
        />
        <Kpi
          label="Revenue Today"
          value={stats ? money(stats.revenueToday) : undefined}
          loading={statsLoading}
        />
        <Kpi
          label="Receivable"
          value={stats ? money(stats.outstandingReceivable) : undefined}
          loading={statsLoading}
        />
      </div>

      {/* Always-open search + filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 flex flex-wrap gap-3 items-center">
        <TextField
          size="small"
          placeholder="Search shop name / city / GSTIN…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              style: { borderRadius: "8px" },
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearch className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment:
                searchPending || isFetching ? (
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
          label="Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(UserRole).map((r) => (
            <MenuItem key={r} value={r}>
              {UserRoleLabel[r]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Kind"
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as ShopKind | "")}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(ShopKind).map((k) => (
            <MenuItem key={k} value={k}>
              {ShopKindLabel[k]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ShopStatus | "")}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(ShopStatus).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          label="State"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center text-sm text-gray-500">
          {rows.length === 0
            ? "You don't have access to any shops yet. Add one to get started."
            : "No shops match these filters."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <ShopCard key={r.shop._id} row={r} />
          ))}
        </div>
      )}
    </div>
  );
};

const Kpi: React.FC<{
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

export default AllShopsPage;
export { AllShopsPage };
