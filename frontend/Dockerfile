FROM node:current-alpine
LABEL authors="aleksejpuhov"

# Рабочая директория для React
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Копируем весь код проекта
COPY frontend/ ./

# Собираем приложение
RUN npm run build

# Запускаем React в режиме разработки
CMD ["npm", "start"]