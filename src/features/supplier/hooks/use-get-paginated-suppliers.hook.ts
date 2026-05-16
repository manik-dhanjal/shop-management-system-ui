import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { SupplierApi } from "@shared/api/supplier.api";

export const usePaginatedSuppliers = (
  limit: number,
  page: number,
  search?: string,
  sort?: Record<string, string>,
  filter?: Record<string, unknown>,
) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [
      activeShop._id,
      "supplier",
      "paginated",
      limit,
      page,
      search,
      sort,
      filter,
    ],
    queryFn: () =>
      SupplierApi.getPaginatedSuppliers(
        activeShop._id,
        limit,
        page,
        search,
        sort,
        filter,
      ),
  });
};
