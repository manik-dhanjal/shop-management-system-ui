import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { OrderApi } from "@shared/api/order.api";
import { CreateOrder } from "../interface/order.interface";

export const useGetPaginatedOrders = (
  limit: number,
  page: number,
  filter?: Partial<CreateOrder>,
  sort?: Record<keyof CreateOrder, string>,
) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [
      activeShop._id,
      "orders",
      "paginated",
      limit,
      page,
      filter,
      sort,
    ],
    queryFn: async () => {
      return OrderApi.getPaginatedOrders(
        activeShop._id,
        limit,
        page,
        filter,
        sort,
      );
    },
  });
};
