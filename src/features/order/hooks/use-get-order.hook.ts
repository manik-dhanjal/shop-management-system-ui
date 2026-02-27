import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { OrderApi } from "@shared/api/order.api";

export const useGetOrder = (orderId: string) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      return OrderApi.getOrder(activeShop._id, orderId);
    },
  });
};
