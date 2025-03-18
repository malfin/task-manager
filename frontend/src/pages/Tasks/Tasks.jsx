import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Chip,
    Box,
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from '../../service/axios.js';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Tasks = () => {
    const { id } = useParams(); // Получаем ID проекта из URL
    const [project, setProject] = useState(null); // Состояние для данных о проекте
    const [tasks, setTasks] = useState([]); // Состояние для списка задач
    const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок
    const [openDialog, setOpenDialog] = useState(false); // Состояние для открытия/закрытия диалога
    const [users, setUsers] = useState([]); // Состояние для списка пользователей
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        deadline: '',
        status: 'new',
        assignees: [],
    }); // Состояние для новой задачи

    // Загрузка данных о проекте, задачах и пользователях
    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectResponse = await axios.get(`/projects/${id}/tasks`);
                const usersResponse = await axios.get('/users');
                setProject(projectResponse.data.project);
                setTasks(projectResponse.data.project.tasks);
                setUsers(usersResponse.data.users);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Открытие диалога для добавления задачи
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Закрытие диалога
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewTask({
            title: '',
            description: '',
            deadline: '',
            status: 'new',
            assignees: [],
        });
    };

    // Обработка изменения полей формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Обработка выбора пользователей
    const handleAssigneesChange = (e) => {
        setNewTask((prev) => ({
            ...prev,
            assignees: e.target.value,
        }));
    };

    // Отправка новой задачи на сервер
    const handleAddTask = async () => {
        try {
            const response = await axios.post(`/projects/${id}/tasks/create`, newTask);
            const createdTask = response.data.task;

            // Добавляем assignees вручную
            createdTask.assignees = users.filter(user => newTask.assignees.includes(user.id));

            setTasks((prev) => [...prev, createdTask]); // Добавляем новую задачу в список
            handleCloseDialog(); // Закрываем диалог
        } catch (err) {
            console.error('Ошибка при добавлении задачи:', err);
        }
    };

    // Функция для получения цвета статуса
    const getStatusColor = (status) => {
        switch (status) {
            case 'done':
                return 'success';
            case 'new':
                return 'primary';
            case 'in_progress':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Функция для получения текста статуса
    const getStatusText = (status) => {
        switch (status) {
            case 'done':
                return 'Завершено';
            case 'new':
                return 'Новая';
            case 'in_progress':
                return 'В процессе';
            default:
                return 'Неизвестно';
        }
    };

    // Отображение загрузки
    if (loading) {
        return (
            <>
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Skeleton variant="text" width="60%" height={40} />
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="text" width="50%" height={20} />
                    </CardContent>
                </Card>

                {/* Скелетоны для карточек задач */}
                {[1, 2, 3].map((_, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            <Skeleton variant="text" width="50%" height={30} />
                            <Skeleton variant="text" width="70%" height={20} />
                            <Skeleton variant="text" width="40%" height={20} />
                            <Skeleton variant="text" width="30%" height={20} />
                            <Skeleton variant="text" width="60%" height={20} />
                        </CardContent>
                    </Card>
                ))}
            </>
        );
    }

    // Отображение ошибки
    if (error) {
        return <Typography color="error">Ошибка: {error}</Typography>;
    }

    // Если данные о проекте не загружены
    if (!project) {
        return <Typography>Проект не найден.</Typography>;
    }

    return (
        <>
            {/* Карточка проекта */}
            <Card
                key={project.id}
                sx={{
                    mb: 2,
                    '&:hover': { cursor: 'pointer', transform: 'translateY(-5px)', transition: 'transform 0.3s' },
                }}
            >
                <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {project.description}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Автор: {project.created_by}
                    </Typography>
                    <Typography variant="caption" display="block">
                        Дата создания: {new Date(project.created_at).toLocaleString()}
                    </Typography>
                </CardContent>
            </Card>

            {/* Карточки задач */}
            {tasks.map((task) => (
                <Card
                    key={task.id}
                    sx={{
                        mb: 2,
                        '&:hover': { cursor: 'pointer', transform: 'translateY(-5px)', transition: 'all 0.3s' },
                    }}
                >
                    <CardContent>
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {task.description}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Дедлайн: {new Date(task.deadline).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" display="block">
                            Статус:
                            <Chip
                                label={getStatusText(task.status)}
                                color={getStatusColor(task.status)}
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        </Typography>
                        <Typography variant="caption" display="block">
                            Исполнители:
                        </Typography>
                        <List dense>
                            {task.assignees.map((assignee) => (
                                <ListItem key={assignee.id}>
                                    <ListItemText primary={assignee.username} secondary={assignee.email} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}

            {/* SpeedDial для быстрых действий */}
            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, position: 'fixed', bottom: 16, right: 16 }}>
                <SpeedDial
                    ariaLabel="SpeedDial для задач"
                    icon={<SpeedDialIcon />}
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                >
                    <SpeedDialAction
                        icon={<AddIcon />}
                        tooltipTitle="Добавить задачу"
                        onClick={handleOpenDialog}
                    />
                </SpeedDial>
            </Box>

            {/* Диалог для добавления задачи */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Добавить задачу</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Название задачи"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Описание задачи"
                        name="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Дедлайн"
                        type="datetime-local"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Исполнители</InputLabel>
                        <Select
                            multiple
                            value={newTask.assignees}
                            onChange={handleAssigneesChange}
                            label="Исполнители"
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleAddTask} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Tasks;