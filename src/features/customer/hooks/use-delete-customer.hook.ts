import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { CustomerApi } from "@shared/api/customer.api";
import { AxiosError } from "axios";
import { isArray } from "lodash";

export const useDeleteCustomer = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (customerId: string) => {
      return CustomerApi.deleteCustomer(activeShop._id, customerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "customers", "paginated"],
      });
      addAlert("Customer deleted successfully!", AlertSeverity.SUCCESS);
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
          "Unknown error occurred while deleting customer",
          AlertSeverity.ERROR,
        );
      }
    },
  });
};
