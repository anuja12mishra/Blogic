import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { handleError } from '../helpers/handleError.js';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(handleError(401, 'Unauthorized: No token provided'));
        }

        jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
            if (err) {
                return next(handleError(401, 'Unauthorized: Invalid token'));
            }
            req.user = user;
            next();
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};
