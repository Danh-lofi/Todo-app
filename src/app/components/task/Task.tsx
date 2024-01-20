"use client"
import { Card, Grid, Skeleton } from '@mui/material'
import React from 'react'
import TaskItem from './TaskItem'
import { ITask } from '../../types/task'
type IProps = {
  tasks: ITask[]
  onDeleteTask: (id: string) => void;
  onEditRow: (task: ITask) => void;
  onCompletedTask: (id: string) => void;

}
const Task = ({
  tasks,
  onDeleteTask,
  onEditRow,
  onCompletedTask
}: IProps) => {
  return (
    <Grid container mt={3} spacing={3}>
      {!tasks.length ?
      ['','',''].map((item, index) => (
        <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card sx={{ p: 2, my: 1, width: '100%' }} key={index}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', mt: 1 }} />
          <Skeleton variant="rounded" width="100%" height={60} sx={{ mt: 1 }} />
          <Grid mt={1} item container md={12} justifyContent="space-between">
            <Skeleton variant="text" width={100} sx={{ fontSize: '1rem' }} />
            <Skeleton variant="text" width={20} sx={{ fontSize: '1rem' }} />
          </Grid>
        </Card>
          </Grid>
      ))
        :
        tasks.map((task: ITask, index) => <TaskItem key={index} task={task} onDeleteTask={onDeleteTask} onEditRow={onEditRow} onCompletedTask={onCompletedTask} />)}
    </Grid>
  )
}

export default Task