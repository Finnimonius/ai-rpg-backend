import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const registerSchema = Joi.object({
    nickName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.alphanum': 'Имя пользователя должно содержать только буквы и цифры',
            'string.min': 'Имя пользователя должно содержать минимум 3 символа',
            'string.max': 'Имя пользователя не должно превышать 30 символов',
            'string.empty': 'Имя пользователя обязательно для заполнения',
            'any.required': 'Имя пользователя обязательно для заполнения'
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru', 'org'] } })
        .required()
        .messages({
            'string.email': 'Некорректный формат email',
            'string.empty': 'Email обязателен для заполнения',
            'any.required': 'Email обязателен для заполнения'
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': 'Пароль должен содержать минимум 8 символов',
            'string.max': 'Пароль не должен превышать 128 символов',
            'string.pattern.base': 'Пароль должен содержать буквы в верхнем и нижнем регистре, цифры и специальные символы',
            'string.empty': 'Пароль обязателен для заполнения',
            'any.required': 'Пароль обязателен для заполнения'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password')) // должно совпадать с password
        .required()
        .messages({
            'any.only': 'Пароли не совпадают',
            'any.required': 'Подтверждение пароля обязательно'
        }),

});

export const authValidateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = registerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);

        return res.status(400).json({
            error: 'Ошибка валидации',
            details: errorMessages
        });
    }

    req.body = value;
    next()
}