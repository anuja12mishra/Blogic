import express from 'express';
import { DeleteUser, GetAllUsers, getUserAnalytics, getUserDetails, getUserProfile, updateUserDetails } from '../controllers/User.controller.js';
import upload from '../config/multer.config.js';
import { onlyadmin } from '../middleware/onlyAdmin.js';
import { authenticate } from '../middleware/authenticate.js';
const UserRoute = express.Router();

UserRoute.delete('/delete/:userId',onlyadmin, DeleteUser);
UserRoute.get('/get-all-users',onlyadmin,GetAllUsers);

UserRoute.put('/user-update/:userId',authenticate, upload.single('file'), updateUserDetails);
UserRoute.get('/user-details/:userId',authenticate, getUserDetails);
UserRoute.get('/analytics/:userId', authenticate, getUserAnalytics);
UserRoute.get('/public-details/:username', getUserProfile);

export default UserRoute;