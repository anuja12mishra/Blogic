import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { handleError } from '../helpers/handleError.js';
import User from '../models/user.model.js';
import { AuthRequest } from './authenticate.js';

export const onlyadmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(handleError(403, 'Unauthorized access'));
        }

        const decodeToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        const isUser = await User.findById(decodeToken._id);

        if (!isUser) {
            return next(handleError(403, 'Account has been deleted by Developer or Admin'));
        }

        if (decodeToken.role === 'admin') {
            req.user = decodeToken;
            return next();
        }

        return next(handleError(403, 'Unauthorized access'));

    } catch (error: any) {
        return next(handleError(500, error.message));
    }
};
