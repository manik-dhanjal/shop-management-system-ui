import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";
import { queryClient } from "@/main";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useDeleteShop = () => {
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: (shopId: string) => ShopApi.deleteShop(shopId),
    onSuccess: (_, shopId) => {
      queryClient.removeQueries({ queryKey: ["shop", shopId] });
      queryClient.invalidateQueries({ queryKey: ["shop", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["shop", "mine", "stats"] });
      addAlert("Shop deleted", AlertSeverity.SUCCESS);
    },
  });
};
