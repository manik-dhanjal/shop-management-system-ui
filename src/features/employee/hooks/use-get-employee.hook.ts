import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { AuthApi } from "@shared/api/auth.api";

// useQuery Hook
export const useGetEmployee = (employeeId: string) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: ["user", employeeId],
    queryFn: async () => {
      return AuthApi.getEmployee(activeShop._id, employeeId);
    },
  });
};
