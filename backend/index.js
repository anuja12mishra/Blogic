import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRoute from './routes/Auth.route.js';
import UserRoute from './routes/User.route.js';
import CategoryRoute from './routes/Category.route.js';
import BlogRoute from './routes/Blog.route.js';

//getting the envs
import dotenv from 'dotenv';
dotenv.config();

//Port
const Port = process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}))
app.use(express.urlencoded({
    extended: true
}));

//Routes
app.use('/api/auth',AuthRoute);
app.use('/api/user',UserRoute);
app.use('/api/category',CategoryRoute);
app.use('/api/blog',BlogRoute);

mongoose.connect(process.env.MONGODB_URL, {
        dbName: 'blogic'
    })
    .then(() => console.log('✅ Database connected'))
    .catch(err => {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


//Running port
app.listen(Port, () => {
    console.log(`Server is running at port ${Port}`)
})