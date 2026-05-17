import { useQuery } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";

export const useMyShops = (q?: string) =>
  useQuery({
    queryKey: ["shop", "mine", q],
    queryFn: () => ShopApi.getMyShops(q),
  });
