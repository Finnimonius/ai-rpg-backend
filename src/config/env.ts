import dotenv from 'dotenv';

dotenv.config()

export const config = {
    yandex: {
        apiKey: process.env.YANDEX_API_KEY,
        folderId: process.env.YANDEX_FOLDER_ID
    },
    server: {
        port: process.env.PORT || 3001
    }
}

export function validateConfig() {
    if (!config.yandex.apiKey) {
        throw new Error('Добавь файл в .env')
    }

    console.log('Конфигурация загружена');
}