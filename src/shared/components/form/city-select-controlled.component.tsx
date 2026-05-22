import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { CityOption } from "@shared/interfaces/location.interface";
import { useCitiesByState } from "@features/location/hooks/use-cities-by-state.hook";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value.hook";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  countryCode?: string;
  stateCode?: string;
  required?: boolean;
  className?: string;
  onCityChange?: (option: CityOption | null) => void;
}

export const CitySelectControlled = ({
  control,
  name,
  label,
  countryCode = "IN",
  stateCode,
  required,
  className,
  onCityChange,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedQ = useDebouncedValue(inputValue, 300);

  const { data: cities = [], isLoading } = useCitiesByState(
    countryCode,
    stateCode,
    debouncedQ || undefined,
  );

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const selected =
            cities.find((c) => c.name === field.value) ?? null;

          return (
            <Autocomplete
              freeSolo
              options={cities}
              getOptionLabel={(o) =>
                typeof o === "string" ? o : o.name
              }
              value={selected ?? field.value ?? ""}
              inputValue={inputValue || field.value || ""}
              loading={isLoading}
              onInputChange={(_, val) => setInputValue(val)}
              onChange={(_, option) => {
                if (typeof option === "string") {
                  field.onChange(option);
                  onCityChange?.(null);
                } else {
                  field.onChange(option?.name ?? "");
                  onCityChange?.(option ?? null);
                }
              }}
              onBlur={() => {
                if (inputValue && !selected) {
                  field.onChange(inputValue);
                }
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
        }}
      />
    </div>
  );
};
