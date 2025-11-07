import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import characterRoutes from './routes/characterRoutes';
import cookieParser from 'cookie-parser';
import { config, validateConfig } from './config/env';
import { connectToDatabase } from './config/database';

validateConfig()

const app = express(); // Создаем экземпляр приложения Express
const PORT = config.server.port; // Получаем порт из конфига

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true // разрешаем куки
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/game', gameRoutes)

async function startServer() {
    try {
        await connectToDatabase(); // Ждем подключения к MongoDB

        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        })
    } catch (error) {
        console.error('Не удалось запустить сервер', error);
        process.exit(1); // Завершаем процесс с ошибкой
    }
}

startServer();
