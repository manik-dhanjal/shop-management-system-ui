import { useMutation } from "@tanstack/react-query";
import { CustomerApi } from "@shared/api/customer.api";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { AddCustomer } from "@features/customer/interface/customer.interface";

export const usePutCustomer = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (payload: AddCustomer) =>
      CustomerApi.putCustomer(activeShop._id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        [activeShop._id, "customer", updated._id],
        updated,
      );
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "customer", "paginated"],
      });
      addAlert(`Customer updated`, AlertSeverity.SUCCESS);
    },
  });
};
