import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { OrderApi } from "@shared/api/order.api";

export const useGetOrderPopulated = (orderId: string) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: ["order", orderId, "populated"],
    queryFn: async () => {
      return OrderApi.getOrderPopulated(activeShop._id, orderId);
    },
    enabled: !!orderId,
  });
};
