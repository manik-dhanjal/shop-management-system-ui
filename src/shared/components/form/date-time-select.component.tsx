import { Control, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";

type TextFieldControlledProps = DateTimePickerProps & {
  control: Control<any>;
  name: string;
  label: string;
};

export const DateTimeSelect = ({
  name,
  label,
  control,
}: TextFieldControlledProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DateTimePicker
            value={value}
            onChange={onChange}
            label={label}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                InputProps: {
                  sx: { borderRadius: 2 }, // 8px = theme.spacing(2)
                },
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
