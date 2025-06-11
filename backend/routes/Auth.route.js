import express from 'express';
import {Register,Login, GoogleLogin} from '../controllers/Auth.controller.js';

const AuthRoute = express.Router();

AuthRoute.post('/register',Register);
AuthRoute.post('/login',Login);
AuthRoute.post('/google-login',GoogleLogin);

export default AuthRoute;