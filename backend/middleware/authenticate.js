import jwt, {
    decode
} from 'jsonwebtoken';
import { handleError } from '../helpers/handleError.js';

export const authenticate = (req, res, next) => {
    try {
        // Fixed: req.cookies instead of req.cookie
        const token = req.cookies.access_token;
        // console.log('req.cookies:', req.cookies);
        
        if (!token) {
            return next(handleError(403, 'Unauthorized access'));
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('decodeToken',decodeToken)
        req.user = decodeToken;
        return next(); // Added return for consistency
        
    } catch (error) {
        return next(handleError(500, error.message));
    }
};