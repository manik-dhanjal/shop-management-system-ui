import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";
import { useShop } from "@shared/hooks/shop.hook";
import { AddUser } from "../../user/interface/user.interface";
import { EmployeeApi } from "@shared/api/employee.api";

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
      return EmployeeApi.updateEmployee(
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
