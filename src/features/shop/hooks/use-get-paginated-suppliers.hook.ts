import { useQuery } from "@tanstack/react-query";
import { Shop } from "../interface/shop.interface";
import { useShop } from "@shared/hooks/shop.hook";
import { ShopApi } from "@shared/api/shop.api";

export const useGetPaginatedSuppliers = (
  limit: number,
  page: number,
  filter?: Partial<Shop<string>>,
  sort?: Record<keyof Shop<string>, string>,
) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "shop", "paginated", limit, page, filter, sort],
    queryFn: async () => {
      return ShopApi.getPaginatedSuppliers(
        activeShop._id,
        limit,
        page,
        filter,
        sort,
      );
    },
  });
};
