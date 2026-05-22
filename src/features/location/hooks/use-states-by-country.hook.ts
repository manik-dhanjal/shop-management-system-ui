import { useQuery } from "@tanstack/react-query";
import { LocationApi } from "@shared/api/location.api";

export const useStatesByCountry = (countryCode: string | undefined) =>
  useQuery({
    queryKey: ["location", "states", countryCode],
    queryFn: () => LocationApi.getStatesByCountry(countryCode!),
    enabled: !!countryCode,
    // Always refetch on mount so a stale empty cache (pre-seeder) doesn't get stuck
    refetchOnMount: "always",
    staleTime: (query) =>
      query.state.data?.length ? 60 * 60 * 1000 : 0,
  });
