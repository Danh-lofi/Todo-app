import { Grid } from '@mui/material'
import RHFTextField from '../hook-form/RHFTextField'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs';
import CustomDatePicker from '../hook-form/RHFDate';


const CreateTask = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <RHFTextField name="title" label="Title" shrink={false} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <CustomDatePicker name="finishDate"  defaultValue={null} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <RHFTextField name="description" label='Description' shrink={false} multiline rows={4} />
      </Grid>
    </Grid>
  )
}

export default CreateTask