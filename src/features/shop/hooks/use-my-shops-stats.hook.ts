import { useQuery } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";

export const useMyShopsStats = () =>
  useQuery({
    queryKey: ["shop", "mine", "stats"],
    queryFn: () => ShopApi.getMyShopsStats(),
  });
