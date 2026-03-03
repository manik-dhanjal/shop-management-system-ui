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
import { useEffect, useState } from "react";
import { useGetDropdownOptions } from "@features/form/hooks/use-get-dropdown-options.hook";
import { GetDropdownOptionsPayload } from "@shared/api/form.api";

type OptionType = {
  label: string;
  value: any;
};

type AsyncDropdownControlledProps = {
  control: Control<any>;
  name: string;
  label: string;
  className?: string;
  entityType: string;
  labelKey: string;
  valueKey: string;
};

type AsyncDropdownProps = {
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  className?: string;
  fieldState: ControllerFieldState;
  entityType: string;
  labelKey: string;
  valueKey: string;
};

const useStyles = makeStyles({
  root: {
    borderRadius: 8,
  },
  option: {
    fontSize: 14,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

export const AsyncDropdownControlled = ({
  name,
  control,
  label,
  className,
  entityType,
  labelKey,
  valueKey,
}: AsyncDropdownControlledProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <AsyncDropdown
        field={field}
        label={label}
        className={className}
        fieldState={fieldState}
        entityType={entityType}
        labelKey={labelKey}
        valueKey={valueKey}
      />
    )}
  />
);

export default function AsyncDropdown({
  field,
  label,
  className,
  fieldState,
  entityType,
  labelKey,
  valueKey,
}: AsyncDropdownProps) {
  const classes = useStyles();
  const payload: GetDropdownOptionsPayload = {
    entityType,
    labelField: labelKey,
    valueField: valueKey,
    query: { limit: 50, page: 1 },
  };

  const { data, isLoading } = useGetDropdownOptions(payload);
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    if (data?.docs) {
      setOptions(
        data.docs.map((opt) => ({ label: opt.label, value: opt.value })),
      );
    }
  }, [data]);
  return (
    <Autocomplete
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px", // Change borderRadius here
        },
        "& .MuiAutocomplete-popupIndicator": {
          borderRadius: "8px", // Change borderRadius of popup indicator
        },
      }}
      className={className}
      options={options}
      loading={isLoading}
      getOptionLabel={(option: OptionType) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      classes={{
        option: classes.option,
      }}
      onChange={(_, data) => field.onChange(data?.value)}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
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
              style: {
                borderRadius: "8px",
              },
              autoComplete: "new-password", // disable autocomplete and autofill
            },
          }}
        />
      )}
    />
  );
}
