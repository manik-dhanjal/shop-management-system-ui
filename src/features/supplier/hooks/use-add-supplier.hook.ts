import { useMutation } from "@tanstack/react-query";
import { SupplierApi } from "@shared/api/supplier.api";
import { AddSupplier } from "@features/supplier/interface/supplier.interface";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useAddSupplier = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: (payload: AddSupplier) =>
      SupplierApi.createSupplier(activeShop._id, payload),
    onSuccess: (created) => {
      queryClient.setQueryData(
        [activeShop._id, "supplier", created._id],
        created,
      );
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "supplier", "paginated"],
      });
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "supplier", "stats"],
      });
      addAlert(
        `Supplier ${created.shop?.name ?? ""} added`,
        AlertSeverity.SUCCESS,
      );
    },
  });
};
