import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { SupplierApi } from "@shared/api/supplier.api";

export const useShopPreview = (targetShopId?: string) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "supplier", "shop-preview", targetShopId],
    enabled: !!targetShopId,
    queryFn: () =>
      SupplierApi.getShopPreview(activeShop._id, targetShopId!),
  });
};
