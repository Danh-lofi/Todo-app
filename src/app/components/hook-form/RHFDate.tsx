import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Control, FieldValues, Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

interface CustomDatePickerProps<T> {
  name: Extract<keyof T, string>;
  error?: boolean;
  helperText?: string;
  defaultValue: any;
  onDateChange?: any;
}

const CustomDatePicker = <T,>({
  name,

  error,
  helperText,
  defaultValue,
  onDateChange,
  ...rest
}: CustomDatePickerProps<T>) => {
    const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={"mui-date"}>
        <Controller
          name={name}
          control={control as Control<FieldValues, any>}
          defaultValue={defaultValue}
          render={({ field: { onChange, value } }) => (
            <DatePicker
            sx={{ width: "100%" }}
              value={value ? dayjs(value) : null}
              onChange={onChange}
              slotProps={{
                actionBar: {
                  actions: ["today", "accept"],
                },
                textField: {
                  error: error,
                  helperText: helperText,
                },
              }}
              {...rest}
            />
          )}
        />
      </div>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;