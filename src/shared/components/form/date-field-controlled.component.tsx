import { Controller, Control } from "react-hook-form";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

type DateFieldControlledProps = Omit<TextFieldProps, "type" | "value"> & {
  control: Control<any>;
  name: string;
};

/**
 * react-hook-form bound date picker that mirrors `TextFieldControlled`'s API
 * (same styling, error handling, `slotProps` merging) but specializes for
 * date input. The form value is stored as an ISO timestamp string; the HTML
 * `<input type="date">` only accepts/emits `YYYY-MM-DD`, so this component
 * marshals between the two automatically.
 *
 * Use:
 *   <DateFieldControlled name="orderDate" control={control} label="Order Date" />
 */
export const DateFieldControlled = ({
  name,
  control,
  className,
  slotProps,
  ...props
}: DateFieldControlledProps) => {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const { onChange: userOnChange, ...restProps } = props as any;

          // form state holds an ISO string; convert to YYYY-MM-DD for the input.
          const inputValue = field.value
            ? new Date(field.value).toISOString().slice(0, 10)
            : "";

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const next = e.target.value
              ? new Date(e.target.value).toISOString()
              : "";
            field.onChange(next);
            if (typeof userOnChange === "function") userOnChange(e);
          };

          return (
            <MuiTextField
              {...restProps}
              type="date"
              value={inputValue}
              onChange={handleChange}
              onBlur={field.onBlur}
              name={field.name}
              inputRef={field.ref}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              className="w-full"
              slotProps={{
                ...slotProps,
                // shrink label by default — a date input always has a value or
                // placeholder dashes, so the floating label would otherwise
                // overlap the date text.
                inputLabel: {
                  shrink: true,
                  ...(slotProps?.inputLabel as object),
                },
                input: {
                  style: { borderRadius: "8px", width: "100%" },
                  ...(slotProps?.input as object),
                },
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default DateFieldControlled;
