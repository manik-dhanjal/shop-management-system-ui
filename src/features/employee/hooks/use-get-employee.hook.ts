import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { EmployeeApi } from "@shared/api/employee.api";

// useQuery Hook
export const useGetEmployee = (employeeId: string) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: ["user", employeeId],
    queryFn: async () => {
      return EmployeeApi.getEmployee(activeShop._id, employeeId);
    },
  });
};
