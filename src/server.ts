import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import { config, validateConfig } from './config/env';
import { connectToDatabase } from './config/database';

validateConfig()

const app = express(); // Создаем экземпляр приложения Express
const PORT = config.server.port; // Получаем порт из конфига

app.use(cors())
app.use(express.json());
app.use('/api/ai', aiRoutes); // Подключаем маршруты по префиксу /api/ai

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
