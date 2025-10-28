import dotenv from 'dotenv';

dotenv.config()

function getEnvVariable(name: string): string {
    const value = process.env[name];
    if(!value) {
        throw new Error(`Переменная окружения ${name} не найдена`);
    }
    return value
}

export const config = {
    yandex: {
        apiKey: getEnvVariable('YANDEX_API_KEY'),
        folderId: getEnvVariable('YANDEX_FOLDER_ID')
    },
    server: {
        port: parseInt(getEnvVariable('PORT')),
    },
    mongodb: {
        uri: getEnvVariable('MONGODB_URI')
    },
    jwt: {
        secret: getEnvVariable('JWT_SECRET'),
        expiresIn: '7d'
    }
}

export function validateConfig() {
    if (!config.yandex.apiKey) {
        throw new Error('Добавь файл в .env');
    }

    console.log('Конфигурация загружена');
}