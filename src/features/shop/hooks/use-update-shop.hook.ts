import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";
import { Shop } from "@features/shop/interface/shop.interface";
import { queryClient } from "@/main";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useUpdateShop = () => {
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: ({
      shopId,
      payload,
    }: {
      shopId: string;
      payload: Partial<Shop>;
    }) => ShopApi.updateShop(shopId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["shop", updated._id], updated);
      queryClient.invalidateQueries({ queryKey: ["shop", "mine"] });
      addAlert("Shop updated", AlertSeverity.SUCCESS);
    },
  });
};
