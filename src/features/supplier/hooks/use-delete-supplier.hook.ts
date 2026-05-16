import { useMutation } from "@tanstack/react-query";
import { SupplierApi } from "@shared/api/supplier.api";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useDeleteSupplier = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (supplierId: string) =>
      SupplierApi.deleteSupplier(activeShop._id, supplierId),
    onSuccess: (_, supplierId) => {
      queryClient.removeQueries({
        queryKey: [activeShop._id, "supplier", supplierId],
      });
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "supplier", "paginated"],
      });
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "supplier", "stats"],
      });
      addAlert("Supplier removed", AlertSeverity.SUCCESS);
    },
  });
};
