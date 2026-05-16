import { CircularProgress } from "@mui/material";
import { useSupplierSuggestions } from "@features/supplier/hooks/use-supplier-suggestions.hook";
import { SupplierShopLookup } from "@features/supplier/interface/supplier.interface";
import { ShopKind } from "@shared/enums/shop-kind.enum";

interface Props {
  onPick: (shop: SupplierShopLookup) => void;
  selectedId?: string;
}

export const SupplierSuggestionRails: React.FC<Props> = ({
  onPick,
  selectedId,
}) => {
  const { data, isLoading } = useSupplierSuggestions();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress size={18} />
      </div>
    );
  }
  if (!data) return null;

  const rails: Array<{ title: string; items: SupplierShopLookup[] }> = [
    { title: "Popular in your state", items: data.popularInYourState },
    { title: "Popular overall", items: data.popularOverall },
    { title: "Recently added", items: data.recentlyAdded },
  ].filter((r) => r.items.length > 0);

  if (rails.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        No suggestions yet — try searching above.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rails.map((rail) => (
        <div key={rail.title}>
          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            {rail.title}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {rail.items.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => onPick(s)}
                className={`flex-shrink-0 w-[220px] text-left p-3 rounded-lg border transition-colors ${
                  selectedId === s._id
                    ? "border-violet-500 bg-violet-50/60 dark:bg-violet-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {s.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">
                  {s.location?.city || s.location?.state || s.phone || "—"}
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
                  <span>
                    {s.linkedByCount ?? 0} link
                    {(s.linkedByCount ?? 0) === 1 ? "" : "s"}
                  </span>
                  {s.kind !== ShopKind.EXTERNAL_SUPPLIER && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                      IN-SYSTEM
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
