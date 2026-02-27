import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { CreateOrder } from "../interface/order.interface";
import { OrderApi } from "@shared/api/order.api";
import { AxiosError } from "axios";
import { isArray } from "lodash";
import { useNavigate } from "react-router-dom";

export const useAddOrder = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newOrder: CreateOrder) => {
      return OrderApi.createOrder(activeShop._id, newOrder);
    },
    onSuccess: (createdOrder) => {
      queryClient.setQueryData(["order", createdOrder._id], createdOrder);
      queryClient.invalidateQueries({
        queryKey: ["order", createdOrder._id],
      });
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "orders", "paginated"],
      });
      addAlert(
        `Order ${createdOrder.invoiceId} created successfully! 🎉`,
        AlertSeverity.SUCCESS,
      );
      navigate("/dashboard/order/all");
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
          "Unknown error occurred while creating order",
          AlertSeverity.ERROR,
        );
      }
    },
  });
};
