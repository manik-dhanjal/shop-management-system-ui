import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";
import { UserRole } from "@shared/enums/user-role.enum";
import { queryClient } from "@/main";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useUpdateMemberRoles = (shopId: string) => {
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: ({
      userId,
      roles,
    }: {
      userId: string;
      roles: UserRole[];
    }) => ShopApi.updateMemberRoles(shopId, userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop", shopId, "members"],
      });
      addAlert("Roles updated", AlertSeverity.SUCCESS);
    },
  });
};
