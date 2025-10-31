import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const registerSchema = Joi.object({
    oldPassword: Joi.string().required(),

    newPassword: Joi.string()
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

    confirmNewPassword: Joi.string()
        .valid(Joi.ref('newPassword')) 
        .required()
        .messages({
            'any.only': 'Пароли не совпадают',
            'any.required': 'Подтверждение пароля обязательно'
        }),
});

export const authValidateChangePassword = (req: Request, res: Response, next: NextFunction) => {
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