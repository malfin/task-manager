# Используем официальный образ PostgreSQL
FROM postgres:latest

# Устанавливаем переменные окружения для настройки PostgreSQL
ENV POSTGRES_USER=malfin
ENV POSTGRES_PASSWORD=malfin
ENV POSTGRES_DB=task-manager

# Открываем порт, на котором будет работать PostgreSQL
EXPOSE 5432

# Копируем скрипты инициализации базы данных, если они есть
# COPY init.sql /docker-entrypoint-initdb.d/

# Запускаем PostgreSQL
CMD ["postgres"]

