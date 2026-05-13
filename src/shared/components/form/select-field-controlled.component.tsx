import { ReactNode } from "react";
import { Controller, Control } from "react-hook-form";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";

export type SelectOption<T extends string | number = string> = {
  label: ReactNode;
  value: T;
};

/** Accept either `["Cash", "UPI"]` or `[{ label, value }]`. */
type RawOption<T extends string | number = string> = T | SelectOption<T>;

type SelectFieldControlledProps<T extends string | number = string> = Omit<
  TextFieldProps,
  "select" | "children"
> & {
  control: Control<any>;
  name: string;
  options: RawOption<T>[];
};

const normalize = <T extends string | number>(
  opt: RawOption<T>,
): SelectOption<T> =>
  typeof opt === "object" && opt !== null && "value" in (opt as object)
    ? (opt as SelectOption<T>)
    : ({ label: String(opt), value: opt } as SelectOption<T>);

/**
 * react-hook-form bound dropdown that mirrors `TextFieldControlled`'s API.
 * Pass `options` as either raw values (`["Cash", "UPI"]`) or
 * `{ label, value }` objects. The currently-selected value comes from form
 * state, so the "default" option is whatever you put in `useForm({ defaultValues })`.
 *
 * Use:
 *   <SelectFieldControlled
 *     name="paymentMethod" control={control}
 *     label="Payment Method"
 *     options={Object.values(PaymentMethod)}
 *   />
 */
export const SelectFieldControlled = <T extends string | number = string>({
  name,
  control,
  className,
  slotProps,
  options,
  ...props
}: SelectFieldControlledProps<T>) => {
  const items = options.map(normalize);

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
            <TextField
              {...field}
              // Coerce undefined → "" so React doesn't flip the select from
              // uncontrolled to controlled on first user interaction.
              value={field.value ?? ""}
              {...restProps}
              onChange={handleChange}
              select
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              className="w-full"
              slotProps={{
                ...slotProps,
                input: {
                  style: { borderRadius: "8px", width: "100%" },
                  ...(slotProps?.input as object),
                },
              }}
            >
              {items.map((opt) => (
                <MenuItem key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          );
        }}
      />
    </div>
  );
};

export default SelectFieldControlled;
