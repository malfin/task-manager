import React from 'react';
import { TextField, Button, Container, Box, Typography, Link } from '@mui/material';
import useAuthStore from "../../../state/authStore.js";
import toast from "react-hot-toast";
import axios from "../../../service/axios.js";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const setLogin = useAuthStore((state) => state.setLogin);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/auth/login', { username, password })
            .then((response) => {
                const { access_token, expires_in } = response.data;
                localStorage.setItem('token', access_token);
                axios.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                })
                    .then((userResponse) => {
                        const userData = userResponse.data;
                        setLogin({
                            token: access_token,
                            user: userData,
                            expiresIn: expires_in,
                        });
                        toast.success('Вы успешно авторизованы!');
                        navigate('/');
                    })
                    .catch((userError) => {
                        console.warn('Ошибка при аутентификации:', userError);
                        toast.error('Ошибка при аутентификации. Попробуйте снова.');
                    });
            })
            .catch((error) => {
                console.warn(error.response?.data?.error || 'Не удалось войти. Попробуйте снова.');
                toast.error(error.response?.data?.error || 'Не удалось войти. Попробуйте снова.');
            });
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h3">
                    Авторизация
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Логин"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Войти
                    </Button>
                    <Typography variant="body2">
                        Нет аккаунта?{' '}
                        <Link component={RouterLink} to="/register" sx={{ textDecoration: 'none' }}>
                            Зарегистрируйтесь
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;