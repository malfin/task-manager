import React, {useEffect, useState} from 'react';
import {Container, Card, CardContent, Typography, Button} from '@mui/material';

import toast from 'react-hot-toast';
import axios from "../../service/axios.js";
import {Link} from "react-router-dom";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Нет доступа, требуется авторизация');
            return;
        }

        axios.get('/projects/')
            .then((response) => {
                setProjects(response.data.projects);
            })
            .catch((error) => {
                toast.error('Ошибка при загрузке проектов');
                console.error(error);
            });
    }, []);

    return (
        <Container sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Список проектов</span>
                <Button variant="contained" component={Link} to={'/create/'} sx={{ textDecoration: 'none' }}>
                    Создать проект
                </Button>
            </Typography>
            {projects.length > 0 ? (
                projects.map((project) => (
                    <Card key={project.id} sx={{ mb: 2, '&:hover': { cursor: 'pointer', transition: '-5px' } }}>
                        <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                        </Link>
                    </Card>
                ))
            ) : (
                <Typography variant="body1">Проектов пока нет.</Typography>
            )}
        </Container>
    );
};

export default Projects;
