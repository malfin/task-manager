import { create } from 'zustand';
import axios from "../service/axios.js";


const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Данные пользователя
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
    token: localStorage.getItem('token') || null,
    expiresIn: null, // Время жизни токена

    // Установка данных после входа
    setLogin: (payload) => {
        // Сохраняем данные в localStorage
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        localStorage.setItem('isAuthenticated', true);

        // Устанавливаем таймер для автоматического обновления токена
        if (payload.expiresIn) {
            const refreshTime = (payload.expiresIn - 60) * 1000; // Обновляем токен за 1 минуту до истечения
            setTimeout(() => {
                get().refreshToken(); // Вызываем метод обновления токена
            }, refreshTime);
        }

        // Обновляем состояние
        set({
            token: payload.token,
            user: payload.user,
            isAuthenticated: true,
            expiresIn: payload.expiresIn,
        });
    },

    // Выход из системы
    logout: () => {
        // Удаляем данные из localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');

        // Сбрасываем состояние
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            expiresIn: null,
        });
    },

    // Обновление токена
    refreshToken: async () => {
        const currentToken = get().token;

        if (!currentToken) {
            console.warn('No token available to refresh');
            return;
        }

        try {
            const response = await axios.post('/auth/refresh/', {}, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });

            const { access_token, expires_in } = response.data;

            // Сохраняем новый токен в localStorage
            localStorage.setItem('token', access_token);

            // Устанавливаем таймер для следующего обновления
            const refreshTime = (expires_in - 60) * 1000; // Обновляем токен за 1 минуту до истечения
            setTimeout(() => {
                get().refreshToken();
            }, refreshTime);

            // Обновляем состояние
            set({
                token: access_token,
                expiresIn: expires_in,
            });

            console.log('Токен был обоновлён');
        } catch (error) {
            console.warn('Не удалось обновить токен:', error);
            get().logout(); // Если не удалось обновить токен, выходим из системы
        }
    },
}));

export default useAuthStore;