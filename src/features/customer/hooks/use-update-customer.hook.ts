import { useMutation } from "@tanstack/react-query";
import { CustomerApi } from "@shared/api/customer.api";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useUpdateCustomer = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: ({
      customerId,
      payload,
    }: {
      customerId: string;
      payload: Partial<any>;
    }) => CustomerApi.updateCustomer(activeShop._id, customerId, payload),
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
