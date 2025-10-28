import jwt from "jsonwebtoken";
import { config } from '../config/env';

export const jwtService = {
    generateToken(payload: { userId: string; email: string }): string {
        
        return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
    },

    verifyToken(token: string): { userId: string; email: string } {
        return jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
    }
}