// form
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import { Grid, InputLabel, TextField, TextFieldProps } from '@mui/material';

// ----------------------------------------------------------------------

type ColorType = '#ccc' | '#fff' | '#000';
type BackgroundColorType =
  | '#ccc'
  | '#333'
  | '#000'
  | '#CED8DD'
  | '#CBDDCA'
  | '#fff'
  | '#e9ecef'
  | '#f6fff8';
type PlaceholderColorType = '#fff' | '#333' | '#000' | '#CED8DD';

type Props = TextFieldProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  shrink?: boolean;
  readOnly?: boolean;
  inputColor?: ColorType;
  backgroundColor?: BackgroundColorType;
  placeholderColor?: PlaceholderColorType;
  isLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
};

export default function RHFTextField({
  name,
  helperText,
  label,
  isRequired,
  shrink = true,
  readOnly = false,
  inputColor,
  backgroundColor,
  placeholderColor,
  isLabel,
  size,
  ...other
}: Props) {
  const { control } = useFormContext();


  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => {
        const Component = isLabel ? (
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={4}>
              <InputLabel
                
              >
                {label} {isRequired && <span className="required">*</span>}
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={9} md={9} lg={9} xl={8}>
              <TextField
                inputRef={ref}
                InputLabelProps={{
                  shrink: false,
                  
                }}
                {...field}
                fullWidth
                value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
                error={!!error}
                helperText={error ? error?.message : helperText}
                size={size}
                InputProps={{
                  readOnly,
                 
                }}
                {...other}
              />
            </Grid>
          </Grid>
        ) : (
          <TextField
            label={
              label && (
                <>
                  {label}
                  {isRequired && <span className="required">*</span>}
                </>
              )
            }
            inputRef={ref}
            InputLabelProps={{
              shrink: shrink || field.value,
             
            }}
            {...field}
            fullWidth
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            helperText={error ? error?.message : helperText}
            size={size}
            InputProps={{
              readOnly,
            }}
            {...other}
          />
        );
        return Component;
      }}
    />
  );
}
