import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Link } from '@mui/material';
import toast from 'react-hot-toast';
import axios from '../../../service/axios.js';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        photo_url: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo_url: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        axios.post('/auth/register', data)
            .then(() => {
                toast.success('Регистрация успешна!');
                navigate('/login');
            })
            .catch((error) => {
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    Object.keys(errors).forEach((key) => {
                        errors[key].forEach((msg) => toast.error(msg));
                    });
                } else {
                    toast.error('Ошибка при регистрации.');
                }
            });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3">Регистрация</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField label="Логин" name="username" fullWidth onChange={handleChange} required />
                    <TextField label="Email" name="email" fullWidth onChange={handleChange} required sx={{ mt: 2 }} />
                    <TextField label="Пароль" name="password" type="password" fullWidth onChange={handleChange} required sx={{ mt: 2 }} />
                    <TextField label="Подтвердите пароль" name="password_confirmation" type="password" fullWidth onChange={handleChange} required sx={{ mt: 2 }} />
                    <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                        Загрузить фото
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>Зарегистрироваться</Button>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Есть аккаунт?{' '}
                        <Link component={RouterLink} to="/login" sx={{ textDecoration: 'none' }}>
                            Войти
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
