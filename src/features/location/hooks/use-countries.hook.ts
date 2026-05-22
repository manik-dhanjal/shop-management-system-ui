import { useQuery } from "@tanstack/react-query";
import { LocationApi } from "@shared/api/location.api";

export const useCountries = () =>
  useQuery({
    queryKey: ["location", "countries"],
    queryFn: LocationApi.getCountries,
    staleTime: (query) => (query.state.data?.length ? 24 * 60 * 60 * 1000 : 0),
  });
