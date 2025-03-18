import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    BottomNavigation,
    BottomNavigationAction,
    useMediaQuery,
    useTheme
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LoginIcon from '@mui/icons-material/Login';
import {Link, useNavigate} from 'react-router-dom';
import useAuthStore from "../state/authStore.js";

const Headers = () => {
    const navigate = useNavigate();
    const [mobileMenu, setMobileMenu] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const logout = useAuthStore((state)=>state.logout)
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Элементы меню
    const menuItems = [
        { text: 'Проекты', path: '/', icon: <AccountTreeIcon /> },
        { text: 'Выйти', path: '#', icon: <LoginIcon />, action: handleLogout }
    ];

    const desktopMenu = (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
                item.action ? (
                    <Typography
                        key={item.text}
                        onClick={item.action}
                        sx={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}
                    >
                        {item.text}
                    </Typography>
                ) : (
                    <Typography
                        key={item.text}
                        component={Link}
                        to={item.path}
                        sx={{ color: 'white', textDecoration: 'none' }}
                    >
                        {item.text}
                    </Typography>
                )
            ))}
        </Box>
    );

    return (
        <>
            {/* Верхняя панель только для ПК */}
            {!isMobile && (
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Трекер задач для командной работы
                        </Typography>
                        {desktopMenu}
                    </Toolbar>
                </AppBar>
            )}

            {/* Нижнее меню для мобильных устройств */}
            {isMobile && (
                <BottomNavigation
                    showLabels
                    value={mobileMenu}
                    onChange={(event, newValue) => setMobileMenu(newValue)}
                    sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
                >
                    {menuItems.map((item, index) => (
                        item.action ? (
                            <BottomNavigationAction
                                key={item.text}
                                label={item.text}
                                icon={item.icon}
                                onClick={item.action}
                            />
                        ) : (
                            <BottomNavigationAction
                                key={item.text}
                                label={item.text}
                                icon={item.icon}
                                component={Link}
                                to={item.path}
                            />
                        )
                    ))}
                </BottomNavigation>
            )}
        </>
    );
};

export default Headers;
