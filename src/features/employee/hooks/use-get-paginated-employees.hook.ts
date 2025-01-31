import { useQuery } from "@tanstack/react-query";
import { useShop } from "@shared/hooks/shop.hook";
import { AddUser } from "@features/user/interface/user.interface";
import { AuthApi } from "@shared/api/auth.api";

// useQuery Hook
export const useGetPaginatedEmployees = (
  limit: number,
  page: number,
  filter?: Partial<AddUser>,
  sort?: Record<keyof AddUser, string>
) => {
  const { activeShop } = useShop();
  return useQuery({
    queryKey: [
      activeShop._id,
      "product",
      "paginated",
      limit,
      page,
      filter,
      sort,
    ],
    queryFn: async () => {
      return AuthApi.getPaginatedEmployees(
        activeShop._id,
        limit,
        page,
        filter,
        sort
      );
    },
  });
};
