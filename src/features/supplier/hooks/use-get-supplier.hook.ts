import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { SupplierApi } from "@shared/api/supplier.api";

export const useGetSupplier = (supplierId?: string) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "supplier", supplierId],
    enabled: !!supplierId,
    queryFn: () => SupplierApi.getSupplier(activeShop._id, supplierId!),
  });
};
