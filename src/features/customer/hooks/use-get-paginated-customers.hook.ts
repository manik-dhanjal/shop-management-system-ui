import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { CustomerApi } from "@shared/api/customer.api";

export const usePaginatedCustomers = (
  limit: number,
  page: number,
  search?: string,
  sort?: Record<string, string>,
) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [
      activeShop._id,
      "customer",
      "paginated",
      limit,
      page,
      search,
      sort,
    ],
    queryFn: async () => {
      return CustomerApi.getPaginatedCustomers(
        activeShop._id,
        limit,
        page,
        search,
        sort,
      );
    },
  });
};
