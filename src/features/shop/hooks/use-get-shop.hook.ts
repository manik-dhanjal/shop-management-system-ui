import { useQuery } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";

export const useGetShop = (shopId?: string) =>
  useQuery({
    queryKey: ["shop", shopId],
    enabled: !!shopId,
    queryFn: () => ShopApi.getShop(shopId!),
  });
