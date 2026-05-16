import { useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { IoClose, IoSearch } from "react-icons/io5";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value.hook";
import { useLookupShops } from "@features/supplier/hooks/use-lookup-shops.hook";
import { useRecentSupplierTouches } from "@features/supplier/hooks/use-recent-supplier-touches.hook";
import { SupplierFilters } from "./supplier-filters.component";
import { SupplierResultCard } from "./supplier-result-card.component";
import { SupplierSuggestionRails } from "./supplier-suggestion-rails.component";
import { SupplierPreviewPanel } from "./supplier-preview-panel.component";
import { SupplierCompareTray } from "./supplier-compare-tray.component";
import {
  ShopLookupQuery,
  SupplierShopLookup,
} from "@features/supplier/interface/supplier.interface";

interface Props {
  /** Called when the user confirms a shop to link. Parent navigates to the link-metadata form. */
  onConfirmLink: (shop: SupplierShopLookup) => void;
}

const MAX_COMPARE = 3;

export const FindSupplierPanel: React.FC<Props> = ({ onConfirmLink }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ShopLookupQuery>({ sort: "popular" });
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [compare, setCompare] = useState<SupplierShopLookup[]>([]);

  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const searchPending = searchInput !== debouncedSearch;

  const query: ShopLookupQuery = useMemo(
    () => ({ ...filters, q: debouncedSearch || undefined }),
    [filters, debouncedSearch],
  );

  const {
    data,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useLookupShops(query);

  const allRows: SupplierShopLookup[] = useMemo(
    () => data?.pages.flatMap((p) => p.docs) ?? [],
    [data],
  );

  const { viewed, linked, recordView, recordLink, forgetViewed } =
    useRecentSupplierTouches();

  const handlePick = (shop: SupplierShopLookup) => {
    setSelectedId(shop._id);
    recordView(shop._id, shop.name);
  };

  const handleConfirm = (shop: SupplierShopLookup) => {
    recordLink(shop._id, shop.name);
    onConfirmLink(shop);
  };

  const toggleCompare = (shop: SupplierShopLookup) => {
    setCompare((prev) =>
      prev.some((p) => p._id === shop._id)
        ? prev.filter((p) => p._id !== shop._id)
        : prev.length >= MAX_COMPARE
          ? prev
          : [...prev, shop],
    );
  };

  const hasActiveQuery =
    !!query.q ||
    !!query.state ||
    !!query.city ||
    !!query.kind ||
    (!!query.gstStatus && query.gstStatus !== "any");

  return (
    <div className="space-y-3">
      {/* Search + filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 space-y-3">
        <TextField
          size="small"
          fullWidth
          placeholder="Search by name / phone / GSTIN…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
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
        />
        <SupplierFilters value={filters} onChange={setFilters} />

        {/* Recently linked / viewed chips */}
        {(linked.length > 0 || viewed.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {linked.length > 0 && (
              <>
                <span className="text-gray-400 uppercase">Recently linked:</span>
                {linked.map((r) => (
                  <button
                    key={r.shopId}
                    type="button"
                    onClick={() => setSelectedId(r.shopId)}
                    className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  >
                    {r.name}
                  </button>
                ))}
              </>
            )}
            {viewed.length > 0 && (
              <>
                <span className="text-gray-400 uppercase ml-2">Recently viewed:</span>
                {viewed.map((r) => (
                  <span
                    key={r.shopId}
                    className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(r.shopId)}
                      className="mr-1"
                    >
                      {r.name}
                    </button>
                    <button
                      type="button"
                      aria-label="Forget"
                      onClick={() => forgetViewed(r.shopId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <IoClose />
                    </button>
                  </span>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 max-h-[60vh] overflow-y-auto">
          {!hasActiveQuery ? (
            <SupplierSuggestionRails
              onPick={handlePick}
              selectedId={selectedId}
            />
          ) : isLoading ? (
            <div className="flex justify-center py-10">
              <CircularProgress size={20} />
            </div>
          ) : allRows.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No shops match these filters.
            </div>
          ) : (
            <div className="space-y-2">
              {allRows.map((shop) => (
                <SupplierResultCard
                  key={shop._id}
                  shop={shop}
                  selected={selectedId === shop._id}
                  comparing={compare.some((c) => c._id === shop._id)}
                  canCompare={compare.length < MAX_COMPARE}
                  onPick={handlePick}
                  onToggleCompare={toggleCompare}
                />
              ))}
              {hasNextPage && (
                <div className="pt-2 flex justify-center">
                  <Button
                    size="small"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="min-h-[40vh]">
          <SupplierPreviewPanel
            targetShopId={selectedId}
            onConfirmLink={(prev) =>
              handleConfirm({
                _id: prev._id,
                name: prev.name,
                kind: prev.kind,
                phone: prev.phone,
                email: prev.email,
                gstDetails: prev.gstDetails,
                location: prev.location,
                linkedByCount: prev.linkedByCount,
                alreadyLinked: prev.alreadyLinked,
              })
            }
          />
        </div>
      </div>

      <SupplierCompareTray
        shops={compare}
        onRemove={(id) => setCompare((p) => p.filter((s) => s._id !== id))}
        onClear={() => setCompare([])}
        onLink={(s) => handleConfirm(s)}
      />
    </div>
  );
};
