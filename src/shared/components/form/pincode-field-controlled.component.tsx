import { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { PincodeLookupResult } from "@shared/interfaces/location.interface";
import { usePincodeLookup } from "@features/location/hooks/use-pincode-lookup.hook";
import { useCityPincodes } from "@features/location/hooks/use-city-pincodes.hook";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value.hook";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  countryCode?: string;
  cityRef?: string | null;
  required?: boolean;
  className?: string;
  onPincodeLookup?: (result: PincodeLookupResult | null) => void;
}

export const PincodeFieldControlled = ({
  control,
  name,
  label,
  countryCode = "IN",
  cityRef,
  required,
  className,
  onPincodeLookup,
}: Props) => {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <PincodeFieldInner
            field={field}
            fieldState={fieldState}
            label={label}
            required={required}
            countryCode={countryCode}
            cityRef={cityRef}
            onPincodeLookup={onPincodeLookup}
          />
        )}
      />
    </div>
  );
};

function PincodeFieldInner({
  field,
  fieldState,
  label,
  required,
  countryCode,
  cityRef,
  onPincodeLookup,
}: {
  field: any;
  fieldState: any;
  label: string;
  required?: boolean;
  countryCode: string;
  cityRef?: string | null;
  onPincodeLookup?: (result: PincodeLookupResult | null) => void;
}) {
  const [inputValue, setInputValue] = useState(field.value ?? "");
  const debouncedPin = useDebouncedValue(inputValue, 500);

  const { data: cityPincodes = [] } = useCityPincodes(countryCode, cityRef ?? undefined);
  const { data } = usePincodeLookup(countryCode, debouncedPin);

  useEffect(() => {
    if (data) onPincodeLookup?.(data);
  }, [data]);

  // Keep inputValue in sync when form value changes externally (e.g. reset)
  useEffect(() => {
    setInputValue(field.value ?? "");
  }, [field.value]);

  return (
    <Autocomplete
      freeSolo
      options={cityPincodes}
      value={field.value ?? ""}
      inputValue={inputValue}
      onInputChange={(_, val) => {
        setInputValue(val);
        field.onChange(val);
      }}
      onChange={(_, option) => {
        const val = typeof option === "string" ? option : (option ?? "");
        setInputValue(val);
        field.onChange(val);
      }}
      onBlur={() => {
        if (inputValue !== field.value) field.onChange(inputValue);
        field.onBlur();
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={field.ref}
          label={label + (required ? " *" : "")}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: "new-password",
            },
          }}
        />
      )}
    />
  );
}
