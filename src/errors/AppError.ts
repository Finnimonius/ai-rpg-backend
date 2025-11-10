export class AppError extends Error {
    public statusCode: number;
    public publicMessage?: string;
    
    constructor(message: string, statusCode: number = 500, publicMessage?: string) {
        super(message);
        this.statusCode = statusCode;
        this.publicMessage = publicMessage;
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, message)
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Русурс') {
        super(`${resource} не найден`, 404, `${resource} не найден`)
    }
}

export class InventoryFullError extends AppError {
    constructor() {
        super('INVENTORY_FULL', 400, 'Нет свободного места в инвентаре');
    }
}

export class EquipmentError extends AppError {
    constructor(message: string) {
        super(message, 400, message);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Неверные учетные данные') {
        super(message, 401, message);
    }
}

export class AiServiceError extends AppError {
    constructor(message: string = 'Ошибка AI сервиса') {
        super(message, 503, 'Сервис AI временно недоступен');
    }
}