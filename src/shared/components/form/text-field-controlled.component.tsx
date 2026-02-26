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
  className,
  ...props
}: TextFieldControlledProps) => {
  // apply any tailwind/utility classes to a wrapper div instead of the
  // underlying MUI component. MUI often injects its own CSS class names
  // (e.g. `.css-1xp5r68-MuiFormControl-root-MuiTextField-root`) which can
  // override margin/padding rules coming from `className`. Wrapping the
  // field lets us preserve spacing such as `mb-5`.
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const { onChange: userOnChange, ...restProps } = props as any;
          const handleChange = (e: any) => {
            field.onChange(e);
            if (typeof userOnChange === "function") userOnChange(e);
          };
          return (
            <MuiTextField
              {...field}
              {...restProps}
              onChange={handleChange}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              className="w-full"
              slotProps={{
                input: {
                  style: { borderRadius: "8px", width: "100%" },
                },
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default TextFieldControlled;
