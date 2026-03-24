import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { handleError } from '../helpers/handleError.js';

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // 1. Required fields validation
        if (!name || !email || !password) {
            return next(handleError(403, 'All fields are required'));
        }

        // 2. Gmail validation
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return next(handleError(403, 'Only Gmail addresses are allowed'));
        }

        // 3. Password strength checks
        if (password.length < 6) {
            return next(handleError(403, 'Password must be at least 6 characters long'));
        }

        const hasDigit = /[0-9]/.test(password);
        const hasAlphabet = /[a-zA-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

        if (!hasDigit || !hasAlphabet || !hasSpecialChar) {
            return next(handleError(403, 'Password is too weak'));
        }

        // 4. Check if user already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return next(handleError(409, 'User already exists'));
        }

        // 5. Hash the password
        const salt = parseInt(process.env.SALT!) || 10;
        const hashPass = bcryptjs.hashSync(password, salt);

        // 6. Save the new user
        const newUser = new User({
            name,
            email,
            password: hashPass,
            username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000)
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
        });

    } catch (err: any) {
        console.error(err.message);
        next(handleError(500, err.message));
    }
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(handleError(403, 'Both the fields are required'));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(handleError(404, 'Invalid login credentials'));
        }

        const isValidPass = await bcryptjs.compare(password, user.password!);
        if (!isValidPass) {
            return next(handleError(404, 'Invalid login credentials'));
        }

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        }, process.env.JWT_SECRET!);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        const userObj = user.toObject({ getters: true }) as any;
        delete userObj.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userObj
        });

    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const GoogleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, avatar, name } = req.body;

        if (!email || !name) {
            return next(handleError(403, 'no name or email found'));
        }

        let user = await User.findOne({ email });

        if (!user) {
            const password = Math.floor(Math.random() * 100000000).toString();
            const salt = parseInt(process.env.SALT!) || 10;
            const hashPass = bcryptjs.hashSync(password, salt);

            const newUser = new User({
                email,
                avatar,
                name,
                password: hashPass,
                username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000)
            });

            user = await newUser.save();
        }

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        }, process.env.JWT_SECRET!);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        const userObj = user.toObject({ getters: true }) as any;
        delete userObj.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userObj
        });

    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};
