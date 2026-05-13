import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { apiClient } from "@shared/api/client.api";

/**
 * Peeks the next customer code (`CUST/NNNN`) the backend will assign in this
 * shop. Used to pre-fill the Add Customer form. Doesn't increment the counter.
 */
export const usePreviewCustomerCode = (enabled = true) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "customer", "code", "preview"],
    queryFn: async (): Promise<string> => {
      const res = await apiClient.get<{ customerCode: string }>(
        `/api/v1/shop/${activeShop._id}/customer/code/next`,
      );
      return res.data.customerCode;
    },
    enabled,
  });
};
