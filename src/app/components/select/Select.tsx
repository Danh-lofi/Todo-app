import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type IProps = {
    value: string;
    handleChange: (value: string) => void;
    options: {
        value: string;
        label: string;
    }[];
    title: string;
}
export default function SelectComponent({value, handleChange, options, title}: IProps) {
 

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel sx={{color: '#fff'}} id="demo-select-small-label">{title}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label={title}
        onChange={(e)=>handleChange(e.target.value)}
        sx={{
            border: '1px solid #e0e0e0',
            color: '#fff',
            '& svg':{
                color: '#fff',
            },
            minWidth: '200px',
            
            
        }}
      >
        {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
        )
        )}
      </Select>
    </FormControl>
  );
}