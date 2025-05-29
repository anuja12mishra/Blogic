import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRoute from './routes/Auth.route.js';

dotenv.config();

const Port = process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.urlencoded({
    extended: true
}));

//Routes
app.use('/api/auth',AuthRoute);

mongoose.connect(process.env.MONGODB_URL, {
        dbName: 'blogic'
    })
    .then(() => console.log('✅ Database connected'))
    .catch(err => {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    });

app.use((err, req, res, next) => {
    const statusCode = err.statusCodel || 500;
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