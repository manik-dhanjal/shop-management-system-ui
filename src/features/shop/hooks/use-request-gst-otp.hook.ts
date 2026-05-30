import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";

export const useRequestGstOtp = (shopId: string) =>
  useMutation({
    mutationFn: ({ gstin }: { gstin: string }) =>
      ShopApi.requestGstOtp(shopId, gstin),
  });
