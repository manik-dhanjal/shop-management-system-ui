import { useQuery } from "@tanstack/react-query";
import { LocationApi } from "@shared/api/location.api";
import { PincodeLookupResult } from "@shared/interfaces/location.interface";

export const usePincodeLookup = (
  countryCode: string | undefined,
  pincode: string | undefined,
) =>
  useQuery<PincodeLookupResult | null>({
    queryKey: ["location", "pincode", countryCode, pincode],
    queryFn: async () => {
      try {
        return await LocationApi.lookupPincode(countryCode!, pincode!);
      } catch (err: any) {
        // 404 = pincode not in our database; treat as "no result" not an error
        if (err?.response?.status === 404) return null;
        throw err;
      }
    },
    enabled: !!countryCode && !!pincode && pincode.length >= 5,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
