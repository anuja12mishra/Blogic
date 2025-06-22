import jwt from 'jsonwebtoken';
import { handleError } from '../helpers/handleError.js';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        
        if (!token) {
            return next(handleError(403, 'Unauthorized access'));
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fixed: Added await and proper database query
        const isUser = await User.findById(decodeToken._id);

        if (!isUser) {
            // Clear the cookie since user doesn't exist
            // res.clearCookie('access_token', {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: 'strict'
            // });
            return next(handleError(403, 'Account has been deleted by Admin'));
        }

        req.user = decodeToken;
        return next();
        
    } catch (error) {
        // Handle JWT specific errors
        if (error.name === 'JsonWebTokenError') {
            return next(handleError(403, 'Invalid token'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(handleError(403, 'Token expired'));
        }
        
        return next(handleError(500, error.message));
    }
};