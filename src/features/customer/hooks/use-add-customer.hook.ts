import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { CreateCustomer } from "../interface/customer.interface";
import { CustomerApi } from "@shared/api/customer.api";
import { AxiosError } from "axios";
import { isArray } from "lodash";
import { useNavigate } from "react-router-dom";

export const useAddCustomer = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newCustomer: CreateCustomer) => {
      return CustomerApi.createCustomer(activeShop._id, newCustomer);
    },
    onSuccess: (createdCustomer) => {
      queryClient.setQueryData(
        ["customer", createdCustomer._id],
        createdCustomer,
      );
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "customers", "paginated"],
      });
      addAlert(
        `Customer ${createdCustomer.name} created successfully! 🎉`,
        AlertSeverity.SUCCESS,
      );
      navigate("/dashboard/customer/all");
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
          "Unknown error occurred while creating customer",
          AlertSeverity.ERROR,
        );
      }
    },
  });
};
