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
import { getCountryByLabel } from "@shared/components/form/country-select-controlled.component";
import { State, IState } from "country-state-city";

export type StateSelectControlledProps = {
  control: Control<any>;
  name: string;
  label: string;
  country?: string | null;
  className?: string;
};

type StateSelectProps = {
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  className?: string;
  fieldState: ControllerFieldState;
  country?: string | null;
};

const useStyles = makeStyles({
  option: {
    fontSize: 14,
  },
});

export const StateSelectControlled = ({
  name,
  control,
  label,
  country,
  className,
}: StateSelectControlledProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <StateSelect
        field={field}
        label={label}
        className={className}
        fieldState={fieldState}
        country={country}
      />
    )}
  />
);

function StateSelect({
  field,
  label,
  className,
  fieldState,
  country,
}: StateSelectProps) {
  const classes = useStyles();

  const options = useMemo<readonly StateType[]>(() => {
    if (!country) return [];
    const c = getCountryByLabel(country);
    if (!c?.code) return [];
    const states: IState[] = State.getStatesOfCountry(c.code) || [];
    return states.map((s: IState) => ({ label: s.name, code: s.isoCode }));
  }, [country]);

  const currentValue = options.find((s) => s.label === field.value) || null;

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
      size="small"
      className={className}
      options={options}
      getOptionLabel={(option: StateType) => option.label}
      classes={{ option: classes.option }}
      value={currentValue}
      onChange={(_, data) => field.onChange(data?.label || "")}
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

interface StateType {
  label: string;
  code?: string;
}
