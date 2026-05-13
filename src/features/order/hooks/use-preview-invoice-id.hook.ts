import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { apiClient } from "@shared/api/client.api";

/**
 * Peeks the next invoice number the backend will assign to a new order in this shop.
 * Used to pre-fill the editable Invoice ID on the Add Order form.
 */
export const usePreviewInvoiceId = (enabled = true) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "order", "invoice-id", "preview"],
    queryFn: async (): Promise<string> => {
      const res = await apiClient.get<{ invoiceId: string }>(
        `/api/v1/shop/${activeShop._id}/order/invoice-id/next`,
      );
      return res.data.invoiceId;
    },
    enabled,
  });
};
