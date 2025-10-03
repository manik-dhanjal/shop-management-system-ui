import { Controller, Control } from "react-hook-form";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

type NumberFieldControlledProps = TextFieldProps & {
  control: Control<any>;
  name: string;
};

export const NumberFieldControlled = ({
  name,
  control,
  required,
  ...props
}: NumberFieldControlledProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <MuiTextField
          size="small"
          {...field}
          {...props}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
          onChange={(e) => {
            const floatValue = parseFloat(e.target.value);
            const output = isNaN(floatValue) ? 0 : floatValue;
            field.onChange(output);
          }}
          value={
            isNaN(field.value) || field.value === 0
              ? ""
              : field.value.toString()
          }
        />
      )}
    />
  );
};
