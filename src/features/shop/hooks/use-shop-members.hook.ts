import { useQuery } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";

export const useShopMembers = (shopId?: string) =>
  useQuery({
    queryKey: ["shop", shopId, "members"],
    enabled: !!shopId,
    queryFn: () => ShopApi.listMembers(shopId!),
  });
