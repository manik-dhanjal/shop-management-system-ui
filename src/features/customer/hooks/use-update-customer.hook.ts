import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { UpdateCustomer } from "../interface/customer.interface";
import { CustomerApi } from "@shared/api/customer.api";
import { AxiosError } from "axios";
import { isArray } from "lodash";

export const useUpdateCustomer = (customerId: string) => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (updatedCustomer: UpdateCustomer) => {
      return CustomerApi.updateCustomer(
        activeShop._id,
        customerId,
        updatedCustomer,
      );
    },
    onSuccess: (customer) => {
      queryClient.setQueryData(["customer", customerId], customer);
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "customers", "paginated"],
      });
      addAlert(
        `Customer ${customer.name} updated successfully! 🎉`,
        AlertSeverity.SUCCESS,
      );
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
          "Unknown error occurred while updating customer",
          AlertSeverity.ERROR,
        );
      }
    },
  });
};
