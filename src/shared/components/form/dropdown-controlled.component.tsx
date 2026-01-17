import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { useMemo } from "react";

export type DropdownOption<T = string> = {
  label: string;
  value: T;
};

export type DropdownControlledProps<T = string> = {
  control: Control<any>;
  name: string;
  label: string;
  options: readonly DropdownOption<T>[];
  defaultValue?: T | null;
  className?: string;
  size?: "small" | "medium";
};

type DropdownProps<T = string> = {
  field: ControllerRenderProps<FieldValues, any>;
  label: string;
  className?: string;
  fieldState: ControllerFieldState;
  options: readonly DropdownOption<T>[];
  size?: "small" | "medium";
};

const useStyles = makeStyles({
  option: {
    fontSize: 14,
  },
});

/**
 * Controlled dropdown built using MUI Autocomplete and react-hook-form Controller.
 *
 * Props:
 * - control: react-hook-form control
 * - name: field name
 * - label: input label
 * - options: array of { label, value }
 * - defaultValue: optional default selected value
 */
export const DropdownControlled = <T extends unknown>({
  name,
  control,
  label,
  options,
  defaultValue,
  className,
  size = "small",
}: DropdownControlledProps<T>) => (
  <Controller
    name={name}
    control={control}
    defaultValue={
      // controller stores primitive value (value) rather than option object
      (defaultValue as any) ?? null
    }
    render={({ field, fieldState }) => (
      <Dropdown
        field={field}
        label={label}
        className={className}
        fieldState={fieldState}
        options={options}
        size={size}
      />
    )}
  />
);

function Dropdown<T extends unknown>({
  field,
  label,
  className,
  fieldState,
  options,
  size = "small",
}: DropdownProps<T>) {
  const classes = useStyles();

  const selectedOption = useMemo(() => {
    if (field.value === undefined || field.value === null) return null;
    return options.find((o) => o.value === field.value) || null;
  }, [field.value, options]);

  return (
    <Autocomplete
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
        "& .MuiAutocomplete-popupIndicator": {
          borderRadius: "8px",
        },
      }}
      size={size}
      className={className}
      options={options}
      getOptionLabel={(option: DropdownOption<T>) => option.label}
      classes={{ option: classes.option }}
      value={selectedOption}
      onChange={(_, data) => field.onChange(data?.value ?? null)}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props as any;
        return (
          <Box key={key} component="li" {...optionProps}>
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...field}
          label={label}
          inputRef={field.ref}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              style: { borderRadius: "8px" },
              autoComplete: "new-password",
            },
          }}
        />
      )}
    />
  );
}

export default DropdownControlled;
