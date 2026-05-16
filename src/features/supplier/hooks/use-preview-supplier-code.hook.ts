import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { SupplierApi } from "@shared/api/supplier.api";

/**
 * Peeks the next supplier code (`SUP/NNNN`) the backend will assign in this
 * shop. Used to pre-fill the Add Supplier form. Doesn't increment the counter.
 */
export const usePreviewSupplierCode = (enabled = true) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [activeShop._id, "supplier", "code", "preview"],
    queryFn: async () => {
      const res = await SupplierApi.previewSupplierCode(activeShop._id);
      return res.supplierCode;
    },
    enabled,
  });
};
