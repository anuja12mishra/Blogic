import express from 'express';
import { getUserDetails, updateUserDetails } from '../controllers/User.controller.js';
import upload from '../config/multer.config.js';
const UserRoute = express.Router();

UserRoute.get('/user-details/:userId',getUserDetails);
UserRoute.put('/user-update/:userId',upload.single('file'), updateUserDetails);

export default UserRoute;