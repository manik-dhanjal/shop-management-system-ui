import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";
import { queryClient } from "@/main";

export const useVerifyGstOtp = (shopId: string) =>
  useMutation({
    mutationFn: ({
      gstin,
      otp,
      email,
    }: {
      gstin: string;
      otp: string;
      email?: string;
    }) => ShopApi.verifyGstOtp(shopId, gstin, otp, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", shopId] });
    },
  });
