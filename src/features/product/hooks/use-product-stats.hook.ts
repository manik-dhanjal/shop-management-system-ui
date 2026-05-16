import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { ProductApi } from "@shared/api/product.api";

export const useProductStats = () => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "product", "stats"],
    queryFn: () => ProductApi.getProductStats(activeShop._id),
  });
};
