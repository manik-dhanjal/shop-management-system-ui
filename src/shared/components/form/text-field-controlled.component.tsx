import { Controller, Control } from "react-hook-form";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

type TextFieldControlledProps = TextFieldProps & {
  control: Control<any>;
  name: string;
};

export const TextFieldControlled = ({
  name,
  control,
  required,
  ...props
}: TextFieldControlledProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <MuiTextField
          {...field}
          {...props}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          slotProps={{
            input: {
              style: { borderRadius: "8px", width: "100%" },
            },
          }}
        />
      )}
    />
  );
};
