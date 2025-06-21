import jwt from 'jsonwebtoken';
import { handleError } from '../helpers/handleError.js';

export const onlyadmin = (req, res, next) => {
    try {
        // Fixed: req.cookies instead of req.cookie
        const token = req.cookies.access_token;
        
        if (!token) {
            return next(handleError(403, 'Unauthorized access'));
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('decodeToken',decodeToken)
        if (decodeToken.role === 'admin') {
            req.user = decodeToken;
            return next(); // Added return to prevent further execution
        }
        
        // This will only execute if user is not admin
        return next(handleError(403, 'Unauthorized access'));
        
    } catch (error) {
        return next(handleError(500, error.message));
    }
};