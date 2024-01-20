"use client"
import { Button, Card, Checkbox, Chip, Grid, IconButton, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ITask } from '../../types/task';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';
import Iconify from '../iconify';
import MenuPopover from '../menu-popover';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
type IProps = {
    task: ITask
    onDeleteTask: (id: string) => void;
    onEditRow: (task: ITask) => void;
    onCompletedTask: (id: string) => void;
}
const TaskItem = ({ task, onDeleteTask, onEditRow, onCompletedTask }: IProps) => {
    const formattedDate = (task.finishDate ? new Date(task.finishDate) : new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setOpenPopover(event.currentTarget);
    };
    const handleClosePopover = () => {
        setOpenPopover(null);
    };
    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };



    return (
        <>
            <Grid item xs={12} sm={6} lg={4} >
                <Card sx={{ p: 2, my: 1 }}>
                    <Grid item container md={12} justifyContent="space-between">
                        {
                            task.title.length > 20 ?
                            <Tooltip title={task.title}>
                                 <Typography variant="h6">{task.title.slice(0, 20)}...</Typography>

                            </Tooltip>
                                :
                            <Typography variant="h6">{task.title}</Typography>
                        }
                        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Grid>
                    {
                            task.description.length > 40 ?
                            <Tooltip title={task.description}>
                                 <Typography minHeight={60} mr={4} variant="body1" sx={{lineBreak: "anywhere"}}>{task.description.slice(0, 40)}...</Typography>

                            </Tooltip>
                                :
                            <Typography minHeight={60} mr={4} variant="body1">{task.description}</Typography>
                        }
                    <Grid item container md={12} justifyContent="space-between">
                        <Chip label={formattedDate} color="primary" variant="outlined" sx={{ mt: 3 }} />
                        <Checkbox
                            {...label}
                            icon={<CheckBoxOutlineBlankIcon />}
                            checkedIcon={<CheckBoxIcon />}
                            checked={task.isCompleted}
                            onClick={() => {
                                if (!task.id) return;
                                onCompletedTask(task.id)
                            }
                            }
                        />
                    </Grid>

                </Card>

            </Grid>
            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 140 }}
            >

                <MenuItem
                    onClick={() => {
                        handleOpenConfirm();
                        handleClosePopover();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="eva:trash-2-outline" />
                    Delete
                </MenuItem>


                <MenuItem
                    onClick={() => {
                        onEditRow(task);
                        handleClosePopover();
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>

            </MenuPopover>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title={'Delete'}
                content={`Are you sure you want to delete task ${task.title} ?`}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            if (!task.id) return;
                            onDeleteTask(task.id)
                            setOpenConfirm(false);
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    )
}

export default TaskItem