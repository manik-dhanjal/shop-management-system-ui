import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { OrderApi } from "@shared/api/order.api";
import { AxiosError } from "axios";
import { isArray } from "lodash";

export const useDeleteOrder = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (orderId: string) => {
      return OrderApi.deleteOrder(activeShop._id, orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "orders", "paginated"],
      });
      addAlert("Order deleted successfully", AlertSeverity.SUCCESS);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.message) {
        const message = error.response?.data.message;
        addAlert(
          isArray(message) ? message.join("\n") : message,
          AlertSeverity.ERROR,
        );
      } else {
        addAlert(
          "Unknown error occurred while deleting order",
          AlertSeverity.ERROR,
        );
      }
    },
  });
};
