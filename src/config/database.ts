import { MongoClient, Db } from 'mongodb';
import { config } from './env';

// Объявляем переменные на уровне модуля
let client: MongoClient; // Клиент для работы с MongoDB
let database: Db; // Объект базы данных

export async function connectToDatabase(): Promise<Db> { // Promise<Db> - функция возвращает Promise, который разрешится в Db

    if (database) {
        return database // Если уже подключены, возвращаем существующее подключение
    }

    try {
        // Создаем новый клиент MongoDB с URI из конфига
        client = new MongoClient(config.mongodb.uri);

        // Подключаемся к серверу MongoDB
        await client.connect();

        // Получаем объект базы данных (если имя не указано, берет default)
        database = client.db();

        console.log('Успешно подключились к MongoDb');
        return database

    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error);
        throw error;
    }
}

export function getDataBase(): Db {
    if (!database) {
        throw new Error('База данных не подключена. Сначала вызови connectToDatabase()');  
    }
    return database;
}

export async function closeDataBase(): Promise<void> {
    if(client) {
        await client.close(); // Закрываем подключение
        console.log('отключились от MongoDb'); 
    }
}