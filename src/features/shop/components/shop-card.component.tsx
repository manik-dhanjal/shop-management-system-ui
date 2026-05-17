import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MyShopRow } from "@features/shop/interface/shop.interface";
import { ShopStatus } from "@shared/enums/shop-status.enum";
import { UserRole, UserRoleLabel } from "@shared/enums/user-role.enum";
import { useShop } from "@shared/hooks/shop.hook";
import { useAuth } from "@shared/hooks/auth.hooks";
import { useRecentShops } from "@features/shop/hooks/use-recent-shops.hook";

const money = (n: number | undefined) =>
  `₹${(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const statusChip = (s?: ShopStatus) => {
  switch (s) {
    case ShopStatus.ACTIVE:
      return "bg-emerald-100 text-emerald-800";
    case ShopStatus.INACTIVE:
      return "bg-gray-200 text-gray-700";
    case ShopStatus.SUSPENDED:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const roleChip = (r: UserRole) => {
  switch (r) {
    case UserRole.ADMIN:
      return "bg-violet-100 text-violet-700";
    case UserRole.MANAGER:
      return "bg-blue-100 text-blue-700";
    case UserRole.EMPLOYEE:
      return "bg-gray-100 text-gray-700";
  }
};

export const ShopCard: React.FC<{ row: MyShopRow }> = ({ row }) => {
  const navigate = useNavigate();
  const { activeShop } = useShop();
  const { setActiveShop } = useAuth();
  const { recordSwitch } = useRecentShops();

  const isActive = activeShop?._id === row.shop._id;
  const gstin = row.shop.gstDetails?.gstin;

  const handleSwitch = () => {
    if (setActiveShop(row.shop._id)) {
      recordSwitch(row.shop._id, row.shop.name);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-colors ${
        isActive
          ? "border-violet-500"
          : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-semibold text-gray-900 dark:text-gray-50 truncate">
              {row.shop.name}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${statusChip(row.shop.status)}`}
            >
              {row.shop.status ?? "—"}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {row.roles.map((r) => (
              <span
                key={r}
                className={`text-[10px] px-1.5 py-0.5 rounded ${roleChip(r)}`}
              >
                {UserRoleLabel[r] ?? r}
              </span>
            ))}
          </div>
        </div>
        {isActive && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500 text-white whitespace-nowrap">
            You're here
          </span>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
        {gstin && <div className="font-mono">{gstin}</div>}
        {row.shop.location?.city && (
          <div>
            {row.shop.location.city}
            {row.shop.location.state && `, ${row.shop.location.state}`}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label="Orders today" value={String(row.todayStats.orders)} />
        <Stat label="Revenue today" value={money(row.todayStats.revenue)} />
        <Stat
          label="Receivable"
          value={money(row.todayStats.receivable)}
          danger={row.todayStats.receivable > 0}
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {!isActive && (
          <Button size="small" variant="outlined" onClick={handleSwitch}>
            Switch
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(`/dashboard/shop/${row.shop._id}`)}
        >
          Open
        </Button>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string; danger?: boolean }> = ({
  label,
  value,
  danger,
}) => (
  <div>
    <div className="text-[10px] uppercase text-gray-400">{label}</div>
    <div
      className={`font-medium ${
        danger ? "text-red-600" : "text-gray-800 dark:text-gray-100"
      }`}
    >
      {value}
    </div>
  </div>
);
