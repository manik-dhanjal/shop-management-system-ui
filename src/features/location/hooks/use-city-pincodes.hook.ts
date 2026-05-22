import { useQuery } from "@tanstack/react-query";
import { LocationApi } from "@shared/api/location.api";

export const useCityPincodes = (
  countryCode: string | undefined,
  cityId: string | undefined,
) =>
  useQuery<string[]>({
    queryKey: ["location", "pincodes", countryCode, cityId],
    queryFn: () => LocationApi.getPincodesByCity(countryCode!, cityId!),
    enabled: !!countryCode && !!cityId,
    staleTime: 10 * 60 * 1000,
  });
