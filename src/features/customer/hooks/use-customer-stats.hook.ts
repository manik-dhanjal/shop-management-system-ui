import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { CustomerApi } from "@shared/api/customer.api";

export const useCustomerStats = () => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "customer", "stats"],
    queryFn: () => CustomerApi.getCustomerStats(activeShop._id),
  });
};
