import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import {config, validateConfig} from './config/env';

validateConfig()

const app = express();
const PORT = config.server.port;

app.use(cors())
app.use(express.json());
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
})