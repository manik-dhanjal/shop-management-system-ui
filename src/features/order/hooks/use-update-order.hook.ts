import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";
import { useShop } from "@shared/hooks/shop.hook";
import { CreateOrder } from "../interface/order.interface";
import { OrderApi } from "@shared/api/order.api";

export const useUpdateOrder = () => {
  const { activeShop } = useShop();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      orderId,
      orderChanges,
    }: {
      orderId: string;
      orderChanges: Partial<CreateOrder>;
    }) => {
      return OrderApi.updateOrder(activeShop._id, orderId, orderChanges);
    },
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(["order", updatedOrder._id], updatedOrder);
      queryClient.invalidateQueries({
        queryKey: ["order", updatedOrder._id],
      });
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "orders", "paginated"],
      });
      navigate("/dashboard/order/all");
    },
  });
};
