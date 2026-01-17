import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { Inventory } from "@features/inventory/interface/inventory.interface";
import { InventoryApi } from "@shared/api/inventory.api";

// useQuery Hook
export const useGetPaginatedInventory = (
  limit: number,
  page: number,
  filter?: Partial<Inventory>,
  sort?: Record<keyof Inventory, string>,
) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [
      activeShop._id,
      "inventory",
      "paginated",
      { filter, sort, limit, page },
    ],
    queryFn: async () => {
      return InventoryApi.getPaginatedInventory(
        activeShop._id,
        limit,
        page,
        filter,
        sort,
      );
    },
  });
};
