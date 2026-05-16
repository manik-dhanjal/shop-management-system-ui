import { Checkbox } from "@mui/material";
import { SupplierShopLookup } from "@features/supplier/interface/supplier.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";

interface Props {
  shop: SupplierShopLookup;
  selected?: boolean;
  comparing?: boolean;
  canCompare?: boolean;
  onPick: (shop: SupplierShopLookup) => void;
  onToggleCompare?: (shop: SupplierShopLookup) => void;
}

export const SupplierResultCard: React.FC<Props> = ({
  shop,
  selected,
  comparing,
  canCompare,
  onPick,
  onToggleCompare,
}) => {
  const gstin = shop.gstDetails?.gstin;
  return (
    <button
      type="button"
      onClick={() => onPick(shop)}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        selected
          ? "border-violet-500 bg-violet-50/60 dark:bg-violet-900/20"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
            {shop.name}
            {shop.kind !== ShopKind.EXTERNAL_SUPPLIER && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                IN-SYSTEM
              </span>
            )}
            {shop.alreadyLinked && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                LINKED
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
            {shop.phone && <span>{shop.phone}</span>}
            {gstin && <span className="font-mono">{gstin}</span>}
            {shop.location?.state && <span>{shop.location.state}</span>}
            {shop.location?.city && <span>{shop.location.city}</span>}
          </div>
          {!!shop.linkedByCount && (
            <div className="text-[11px] text-gray-400 mt-1">
              Linked by {shop.linkedByCount} shop
              {shop.linkedByCount === 1 ? "" : "s"}
            </div>
          )}
        </div>

        {onToggleCompare && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0"
          >
            <Checkbox
              size="small"
              checked={!!comparing}
              disabled={!comparing && canCompare === false}
              onChange={() => onToggleCompare(shop)}
              inputProps={{ "aria-label": "Compare" }}
            />
          </div>
        )}
      </div>
    </button>
  );
};
