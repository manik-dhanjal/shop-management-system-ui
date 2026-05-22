import {
  CountryOption,
  StateOption,
  CityOption,
  PincodeLookupResult,
} from "@shared/interfaces/location.interface";
import { apiClient } from "./client.api";

export class LocationApi {
  static async getCountries(): Promise<CountryOption[]> {
    const response = await apiClient.get("/api/v1/location/countries");
    return response.data;
  }

  static async getStatesByCountry(countryCode: string): Promise<StateOption[]> {
    const response = await apiClient.get(
      `/api/v1/location/countries/${countryCode}/states`,
    );
    return response.data;
  }

  static async getCitiesByState(
    countryCode: string,
    stateCode: string,
    q?: string,
    limit = 50,
  ): Promise<CityOption[]> {
    const response = await apiClient.get(
      `/api/v1/location/countries/${countryCode}/states/${stateCode}/cities`,
      { params: { q, limit } },
    );
    return response.data;
  }

  static async lookupPincode(
    countryCode: string,
    pincode: string,
  ): Promise<PincodeLookupResult> {
    const response = await apiClient.get(
      `/api/v1/location/countries/${countryCode}/pincode/${pincode}`,
    );
    return response.data;
  }

  static async getPincodesByCity(
    countryCode: string,
    cityId: string,
  ): Promise<string[]> {
    const response = await apiClient.get(
      `/api/v1/location/countries/${countryCode}/cities/${cityId}/pincodes`,
    );
    return (response.data?.pincodes ?? []).map((p: { code: string }) => p.code);
  }
}
