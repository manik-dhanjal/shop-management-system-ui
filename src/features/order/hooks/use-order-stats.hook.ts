import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { OrderApi } from "@shared/api/order.api";

export const useOrderStats = () => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "orders", "stats"],
    queryFn: () => OrderApi.getOrderStats(activeShop._id),
  });
};
