import { useMutation } from "@tanstack/react-query";
import { ShopApi } from "@shared/api/shop.api";
import { InviteMemberPayload } from "@features/shop/interface/shop.interface";
import { queryClient } from "@/main";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";

export const useInviteMember = (shopId: string) => {
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: (payload: InviteMemberPayload) =>
      ShopApi.inviteMember(shopId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["shop", shopId, "members"],
      });
      addAlert(
        res.status === "linked"
          ? "Existing user added to this shop"
          : "Invite created — share the signup link with them",
        AlertSeverity.SUCCESS,
      );
    },
  });
};
