import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useShop } from "@shared/hooks/shop.hook";
import { AlertSeverity, useAlert } from "@shared/context/alert.context";
import { AddUser } from "../../user/interface/user.interface";
import { AuthApi } from "@shared/api/auth.api";
import { AxiosError } from "axios";
import { isArray } from "lodash";

export const useAddEmployee = () => {
  const { activeShop } = useShop();
  const { addAlert } = useAlert();
  return useMutation({
    mutationFn: (newUser: AddUser) => {
      return AuthApi.addEmployee(activeShop._id, newUser);
    },
    onSuccess: (addedUser) => {
      queryClient.setQueryData(["user", addedUser._id], addedUser);
      queryClient.invalidateQueries({
        queryKey: ["user", addedUser._id],
      });
      addAlert(
        `Successfully added ${addedUser.firstName} as your shop's employee. 🥳`,
        AlertSeverity.SUCCESS
      );
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.message) {
        const message = error.response?.data.message;
        addAlert(
          isArray(message) ? message.join("\n") : message,
          AlertSeverity.ERROR
        );
      } else {
        addAlert(
          "Unknwon error occured while adding employee",
          AlertSeverity.ERROR
        );
      }
    },
  });
};
