"use client"
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Grid, Modal, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import CreateTask from "./components/create-task/CreateTask";
import FormProvider from "./components/hook-form/FormProvider";
import Iconify from "./components/iconify";
import Task from "./components/task/Task";
import styles from "./page.module.css";
import { ITask } from "./types/task";
import img from './assets/empty-data.png';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {xl:600, xs:400},
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  outline: 'none',
  border: 'none',
};

const TaskFormSchema = Yup.object().shape({
  id: Yup.string(),
  title: Yup.string()
    .required('Title is required'),
  description: Yup.string().required('Description is required'),
  finishDate: Yup.date(),
  isCompleted: Yup.boolean(),
});


export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const defaultValues: ITask = {
    id: '0',
    title: "",
    description: "",
    finishDate: new Date(),
    isCompleted: false,
  };
  const methods = useForm({
    resolver: yupResolver(TaskFormSchema),
    defaultValues,
  });


  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ITask) => {
    if (isEdit) {
      const updatedItems = tasks.map(item => {
        if (item.id === data.id) {
          return { ...data };
        }
        return item;
      });

      // Set the state with the updated array
      setTasks(updatedItems);
      handleClose();
      reset(defaultValues);
      return;
    }
    const id = generateRandomId();
    data.id = id;
    addTaskHandle(data);
    handleClose();
    reset(defaultValues);
  }

  const generateRandomId = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    return randomId;
  }
  const addTaskHandle = (task: ITask) => {
    const newTask = [...tasks, task]
    setTasks(newTask)
  }
  const editTaskHandle = (task: ITask) => {
    setIsEdit(true);
    reset({ ...task })
    handleOpen()
  }

  const deleteTaskHandle = (id: number | string) => {
    const newTask = tasks.filter(task => task.id !== id)
    if(newTask.length === 0) {
      setIsEmpty(true);
      localStorage.removeItem('tasks');
    }
    setTasks(newTask);
  }

  const completeTaskHandle = (id: number | string) => {
    const newTask = tasks.map(task => {
      if (task.id === id) {
        return { ...task, isCompleted: !task.isCompleted }
      }
      return task;
    })
    setTasks(newTask);
  }

  const handleClose = async () => {
    if (isEdit) setIsEdit(false);
    await reset(defaultValues)
    setOpen(false)
  };

  const handleOpen = () => setOpen(true);

  const saveLocalStorages = (tasks: ITask[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  useEffect(() => {
    if (tasks.length === 0) {
      setIsEmpty(true);
      return;
    }
    saveLocalStorages(tasks)
    setIsEmpty(false);
  }, [tasks]);

  useEffect(() => {
    const tasks = localStorage.getItem('tasks');
    if (tasks && tasks.length) {
      setTasks(JSON.parse(tasks));
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [])
  return (
    <Container sx={{ my: 5 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography variant="h2" className={styles.title} sx={{ textAlign: "center" }}>To do</Typography>
        <Grid item container md={12} mt={3} justifyContent="space-between">
          <Typography variant="h6" className={styles.subtitle}>Tasks ({tasks.length})</Typography>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Task
          </Button>
        </Grid>
        {isEmpty ?
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Image src={img.src} alt="empty-data" width={300}
              height={300} />
            <Typography variant="h6" className={styles.subtitle}>No tasks</Typography>
          </Box>
          :
          <Task tasks={tasks} onDeleteTask={deleteTaskHandle} onEditRow={editTaskHandle} onCompletedTask={completeTaskHandle} />
        }

        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} >
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h6" mb={3} textAlign="center" sx={{ color: "#000" }} >{isEdit ? 'Edit Task' : 'New Task'}</Typography>
              <CreateTask />
              <Stack alignItems="flex-end">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
                  <Button type="button" variant="outlined" onClick={handleClose}>
                    Back
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEdit ? 'Edit' : 'Save'}
                  </Button>
                </Box>
              </Stack>
            </FormProvider>
          </Box>
        </Modal>
      </LocalizationProvider>
    </Container>
  );
}
