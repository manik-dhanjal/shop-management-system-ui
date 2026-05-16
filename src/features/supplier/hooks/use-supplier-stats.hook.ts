import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { SupplierApi } from "@shared/api/supplier.api";

export const useSupplierStats = () => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "supplier", "stats"],
    queryFn: () => SupplierApi.getSupplierStats(activeShop._id),
  });
};
