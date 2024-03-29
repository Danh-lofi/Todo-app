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
import SelectComponent from "./components/select/Select";


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

 const styleButton = {
    background: 'linear-gradient(90.21deg, rgba(170, 54, 124, 0.5) -5.91%, rgba(74, 47, 189, 0.5) 111.58%)',
    border: '1px solid #fff',
    color: '#fff',
    borderRadius: 0,
    padding: '10px 34px',
   
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
  const [tasksFilter, setTasksFilter] = useState<ITask[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [options, setOptions] = useState<{value: string, label: string}[]>([{
    value: 'all',
    label: 'Task 0'
  }])
  const [typeFilter, setTypeFilter] = useState(options[0].value);
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

  const updateOptionsHandle = (tasks: ITask[]) => {
    return [
    { value: 'all', label: `Task ${tasks.length}`},
    { value: 'completed', label: `Task Completed ${tasks.filter(task=>task.isCompleted).length}` },
    { value: 'uncompleted', label: `Task Uncompleted ${tasks.filter(task=>!task.isCompleted).length}` },
  ]
  }

  const filterTasksHandle = (tasks: ITask[], type: string) => {
    if(type === 'all') return tasks;
    if(type === 'completed') return tasks.filter(task=>task.isCompleted);
    if(type === 'uncompleted') return tasks.filter(task=>!task.isCompleted);
    return tasks;
  }

  const changeTypeFilterHandle = (value: string)=>{
    const listFilter = filterTasksHandle(tasks, value);
    if(listFilter.length === 0) {setIsEmpty(true);}
    else if(isEmpty) {
      setIsEmpty(false);
    }
    setTasksFilter(listFilter);
    setTypeFilter(value);
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
      setTasksFilter(tasks);
      setOptions(updateOptionsHandle(tasks));
      return;
    }
    saveLocalStorages(tasks)
    setIsEmpty(false);
    setOptions(updateOptionsHandle(tasks));
    setTasksFilter(tasks);
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
        <Typography variant="h2" className={styles.title} sx={{ textAlign: "center" }}>TO DO</Typography>
        <Grid item container xs={12} md={12} mt={3} justifyContent="space-between">
          
          <SelectComponent title="Filter" options={options} value={typeFilter} handleChange={changeTypeFilterHandle} />
         
          
            <Button
            onClick={() => setOpen(true)}
            variant="outlined"
            startIcon={<Iconify icon="eva:plus-fill" />}
           
            style={styleButton}
            sx={{
              width: ['100%', 'auto'],
              mt: [2, 0],
            }}
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
          <Task tasks={tasksFilter} onDeleteTask={deleteTaskHandle} onEditRow={editTaskHandle} onCompletedTask={completeTaskHandle} />
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
                  <Button size="small" type="button" variant="outlined" onClick={handleClose}>
                    Back
                  </Button>
                  <Button size="small" type="submit" variant="contained" >
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
