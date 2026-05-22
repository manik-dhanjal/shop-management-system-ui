import { useQuery } from "@tanstack/react-query";
import { LocationApi } from "@shared/api/location.api";

export const useCitiesByState = (
  countryCode: string | undefined,
  stateCode: string | undefined,
  q?: string,
  limit = 50,
) =>
  useQuery({
    queryKey: ["location", "cities", countryCode, stateCode, q, limit],
    queryFn: () =>
      LocationApi.getCitiesByState(countryCode!, stateCode!, q, limit),
    enabled: !!countryCode && !!stateCode,
    staleTime: 10 * 60 * 1000,
  });
