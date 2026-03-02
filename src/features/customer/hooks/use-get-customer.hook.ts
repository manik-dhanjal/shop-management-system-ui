import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { CustomerApi } from "@shared/api/customer.api";

export const useGetCustomer = (customerId: string) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      return CustomerApi.getCustomer(activeShop._id, customerId);
    },
    enabled: !!customerId,
  });
};
