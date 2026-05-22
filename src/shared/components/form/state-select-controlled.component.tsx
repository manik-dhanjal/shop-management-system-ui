import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useRef } from "react";
import { Control, Controller } from "react-hook-form";
import { StateOption } from "@shared/interfaces/location.interface";
import { useStatesByCountry } from "@features/location/hooks/use-states-by-country.hook";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  countryCode?: string;
  required?: boolean;
  className?: string;
  onStateChange?: (option: StateOption | null) => void;
}

export const StateSelectControlled = ({
  control,
  name,
  label,
  countryCode = "IN",
  required,
  className,
  onStateChange,
}: Props) => {
  const {
    data: states = [],
    isLoading,
    isFetching,
    isError,
    status,
    refetch,
  } = useStatesByCountry(countryCode);
  const didRefetch = useRef(false);

  // One-time recovery refetch: if the query completed with an empty list (pre-seeder stale cache),
  // trigger a single re-fetch to pick up newly seeded data.
  useEffect(() => {
    if (
      status === "success" &&
      !states.length &&
      !isFetching &&
      !didRefetch.current
    ) {
      didRefetch.current = true;
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, states.length, isFetching]);

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const selected = states.find((s) => s.name === field.value) ?? null;

          return (
            <Autocomplete
              options={states}
              getOptionLabel={(o) => o.name}
              value={selected}
              loading={isLoading || (isFetching && !states.length)}
              loadingText="Loading states…"
              noOptionsText={
                isError
                  ? "Failed to load states"
                  : isFetching
                    ? "Loading states…"
                    : "No states found"
              }
              onChange={(_, option) => {
                field.onChange(option?.name ?? "");
                onStateChange?.(option);
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  label={label + (required ? " *" : "")}
                  error={fieldState.invalid || isError}
                  helperText={
                    fieldState.error?.message ??
                    (isError
                      ? "Could not load states — check your connection"
                      : undefined)
                  }
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
