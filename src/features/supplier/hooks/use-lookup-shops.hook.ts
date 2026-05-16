import { useInfiniteQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { SupplierApi } from "@shared/api/supplier.api";
import { ShopLookupQuery } from "@features/supplier/interface/supplier.interface";

/**
 * Cursor-based lookup of Shop docs for the find-supplier picker.
 *
 * The query is "enabled" whenever the user has typed something OR set any
 * filter — the empty-no-filter state is handled by the suggestions hook.
 */
export const useLookupShops = (query: ShopLookupQuery) => {
  const { activeShop } = useShop();
  const hasInput =
    !!query.q?.trim() ||
    !!query.state ||
    !!query.city ||
    !!query.kind ||
    (!!query.gstStatus && query.gstStatus !== "any");

  return useInfiniteQuery({
    queryKey: [activeShop._id, "supplier", "lookup", query],
    enabled: hasInput,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      SupplierApi.lookupShops(activeShop._id, {
        ...query,
        cursor: pageParam,
      }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
};
