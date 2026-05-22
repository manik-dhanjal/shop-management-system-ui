import { useEffect } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import TextFieldControlled from "./text-field-controlled.component";
import {
  CountrySelectControlled,
  CountryOption,
  getCountryByLabel,
} from "./country-select-controlled.component";
import { StateSelectControlled } from "./state-select-controlled.component";
import { CitySelectControlled } from "./city-select-controlled.component";
import { PincodeFieldControlled } from "./pincode-field-controlled.component";
import {
  StateOption,
  CityOption,
  PincodeLookupResult,
} from "@shared/interfaces/location.interface";

interface Props {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  namePrefix?: string;
}

export const LocationFormSection = ({
  control,
  setValue,
  namePrefix = "location",
}: Props) => {
  const f = (field: string) => `${namePrefix}.${field}`;

  // Derive country code reactively from the country label stored in the form
  const countryName = useWatch({ control, name: f("country") }) as string | undefined;
  const activeCountryCode = getCountryByLabel(countryName ?? "")?.code ?? "IN";

  const stateCode = useWatch({ control, name: f("stateCode") }) as string | undefined;
  const cityRef = useWatch({ control, name: f("cityRef") }) as string | null | undefined;

  // Auto-populate India as the default country for new forms
  useEffect(() => {
    if (!countryName) {
      setValue(f("country"), "India");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountryChange = (_country: CountryOption | null) => {
    // Reset all dependent fields when user picks a new country
    setValue(f("state"), "");
    setValue(f("stateCode"), "");
    setValue(f("stateRef"), null);
    setValue(f("city"), "");
    setValue(f("cityRef"), null);
    setValue(f("pinCode"), "");
    setValue(f("address"), "");
    setValue(f("addressLine2"), "");
    setValue(f("countryRef"), null);
  };

  const handleStateChange = (option: StateOption | null) => {
    setValue(f("stateCode"), option?.code ?? "");
    setValue(f("stateRef"), option?._id ?? null);
    // clear city when state changes
    setValue(f("city"), "");
    setValue(f("cityRef"), null);
  };

  const handleCityChange = (option: CityOption | null) => {
    setValue(f("cityRef"), option?._id ?? null);
  };

  const handlePincodeLookup = (result: PincodeLookupResult | null) => {
    if (!result) return;
    setValue(f("city"), result.city);
    setValue(f("state"), result.state);
    setValue(f("stateCode"), result.stateCode);
    if (result.cityId) setValue(f("cityRef"), result.cityId);
  };

  return (
    <div className="space-y-4">
      <TextFieldControlled
        label="Address Line 1"
        name={f("address")}
        control={control}
        required
      />
      <TextFieldControlled
        label="Address Line 2"
        name={f("addressLine2")}
        control={control}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CountrySelectControlled
          label="Country"
          name={f("country")}
          control={control}
          required
          onCountryChange={handleCountryChange}
        />
        <StateSelectControlled
          label="State"
          name={f("state")}
          control={control}
          countryCode={activeCountryCode}
          required
          onStateChange={handleStateChange}
        />
        <CitySelectControlled
          label="City"
          name={f("city")}
          control={control}
          countryCode={activeCountryCode}
          stateCode={stateCode}
          required
          onCityChange={handleCityChange}
        />
        <PincodeFieldControlled
          label="Pin Code"
          name={f("pinCode")}
          control={control}
          countryCode={activeCountryCode}
          cityRef={cityRef}
          required
          onPincodeLookup={handlePincodeLookup}
        />
      </div>
    </div>
  );
};
