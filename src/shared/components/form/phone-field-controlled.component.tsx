import { Controller, Control } from "react-hook-form";
import { TextFieldProps } from "@mui/material";
import { MuiTelInput, MuiTelInputCountry } from "mui-tel-input";

type PhoneFieldControlledProps = TextFieldProps & {
  control: Control<any>;
  name: string;
  defaultCountry?: MuiTelInputCountry;
};

export const PhoneFieldControlled = ({
  name,
  control,
  defaultCountry,
  ...rest
}: PhoneFieldControlledProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <MuiTelInput
          {...field}
          {...rest}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          defaultCountry={defaultCountry}
          onChange={(value) => field.onChange(value)}
        />
      )}
    />
  );
};
