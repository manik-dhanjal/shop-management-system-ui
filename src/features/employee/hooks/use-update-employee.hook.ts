import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";
import { useShop } from "@shared/hooks/shop.hook";
import { AddUser } from "../../user/interface/user.interface";
import { AuthApi } from "@shared/api/auth.api";

export const useUpdateEmployee = () => {
  const { activeShop } = useShop();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      employeeId,
      employeeChanges,
    }: {
      employeeId: string;
      employeeChanges: Partial<AddUser>;
    }) => {
      return AuthApi.updateEmployee(
        activeShop._id,
        employeeId,
        employeeChanges
      );
    },
    onSuccess: (updatedEmployee) => {
      queryClient.setQueryData(["user", updatedEmployee._id], updatedEmployee);
      queryClient.invalidateQueries({
        queryKey: ["user", updatedEmployee._id],
      });
      navigate("/dashboard/employee/all");
    },
  });
};
