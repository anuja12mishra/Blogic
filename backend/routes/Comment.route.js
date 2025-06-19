import express from 'express';
import { AddComment } from '../controllers/Comment.controller.js';

const CommentRoute = express.Router();

CommentRoute.post('/add', AddComment);

export default CommentRoute;