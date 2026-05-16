import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { SupplierApi } from "@shared/api/supplier.api";

export const useSupplierSuggestions = () => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "supplier", "suggestions"],
    queryFn: () => SupplierApi.getSuggestions(activeShop._id),
  });
};
