import { useMutation } from "@tanstack/react-query";
import { CustomerApi } from "@shared/api/customer.api";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useDeleteCustomer = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (customerId: string) =>
      CustomerApi.deleteCustomer(activeShop._id, customerId),
    onSuccess: (_, customerId) => {
      queryClient.removeQueries({
        queryKey: [activeShop._id, "customer", customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "customer", "paginated"],
      });
      addAlert(`Customer deleted`, AlertSeverity.SUCCESS);
    },
  });
};
