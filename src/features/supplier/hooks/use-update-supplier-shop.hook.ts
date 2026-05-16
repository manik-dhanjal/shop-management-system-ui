import { useMutation } from "@tanstack/react-query";
import { SupplierApi } from "@shared/api/supplier.api";
import { SupplierShopFormTypes } from "@features/supplier/interface/supplier.interface";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useUpdateSupplierShop = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();

  return useMutation({
    mutationFn: ({
      supplierId,
      payload,
    }: {
      supplierId: string;
      payload: Partial<SupplierShopFormTypes>;
    }) =>
      SupplierApi.updateSupplierShop(activeShop._id, supplierId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        [activeShop._id, "supplier", updated._id],
        updated,
      );
      queryClient.invalidateQueries({
        queryKey: [activeShop._id, "supplier", "paginated"],
      });
      addAlert("Supplier details updated", AlertSeverity.SUCCESS);
    },
  });
};
