import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";
import { queryClient } from "@/main";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useRemoveMember = (shopId: string) => {
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: (userId: string) => ShopApi.removeMember(shopId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop", shopId, "members"],
      });
      addAlert("Member removed", AlertSeverity.SUCCESS);
    },
  });
};
