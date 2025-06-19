import express from 'express';
import { AddComment, CommentCount, GetAllComment } from '../controllers/Comment.controller.js';

const CommentRoute = express.Router();

CommentRoute.post('/add', AddComment);
CommentRoute.get('/get-all-comment/:blogId',GetAllComment);
CommentRoute.get('/comment-count/:blogId',CommentCount);

export default CommentRoute;