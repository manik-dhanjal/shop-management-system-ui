import { useAuth } from "@shared/hooks/auth.hooks";
import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { AxiosError } from "axios";
import { queryClient } from "@/main";
import { ShopEditFormValues } from "@features/shop/components/shop-edit-form.component";

export const useAddShop = () => {
  const { setActiveShop, refreshUser } = useAuth();
  const alert = useAlert();
  return useMutation({
    mutationFn: (newShop: ShopEditFormValues) => ShopApi.addShop(newShop),
    onSuccess: async (addedShop) => {
      await refreshUser();
      setActiveShop(addedShop._id);
      queryClient.invalidateQueries({ queryKey: ["shop", "mine"] });
      queryClient.invalidateQueries({
        queryKey: ["shop", "mine", "stats"],
      });
      alert.addAlert(
        `Shop ${addedShop.name} created`,
        AlertSeverity.SUCCESS,
      );
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        alert.addAlert(error.response?.data.message, AlertSeverity.ERROR);
      } else {
        alert.addAlert("Unable to add shop", AlertSeverity.ERROR);
      }
    },
  });
};
