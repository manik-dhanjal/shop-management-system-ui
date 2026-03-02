import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { CustomerApi } from "@shared/api/customer.api";
import { CreateCustomer } from "../interface/customer.interface";

export const useGetPaginatedCustomers = (
  limit: number,
  page: number,
  filter?: Partial<CreateCustomer>,
  sort?: Record<keyof CreateCustomer, string>,
) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [
      activeShop._id,
      "customers",
      "paginated",
      limit,
      page,
      filter,
      sort,
    ],
    queryFn: async () => {
      return CustomerApi.getPaginatedCustomers(
        activeShop._id,
        limit,
        page,
        filter,
        sort,
      );
    },
  });
};
