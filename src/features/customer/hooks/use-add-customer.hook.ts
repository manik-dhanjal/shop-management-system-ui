import { useMutation } from "@tanstack/react-query";
import { CustomerApi } from "@shared/api/customer.api";
import { AddCustomer } from "@features/customer/interface/customer.interface";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useAddCustomer = () => {
  const { activeShop } = useShop();
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (payload: AddCustomer) =>
      CustomerApi.createCustomer(activeShop._id, payload),
    onSuccess: (created) => {
      queryClient.setQueryData(
        [activeShop._id, "customer", created._id],
        created,
      );
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "customer", "paginated"],
      });
      addAlert(`${created.name} added`, AlertSeverity.SUCCESS);
      navigate("/dashboard/customer/all");
    },
  });
};
