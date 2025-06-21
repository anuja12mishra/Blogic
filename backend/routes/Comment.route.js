import express from 'express';
import { AddComment, CommentCount, DeleteComment, GetAllComment, GetAllCommentByBlogId, ProtectedGetAllComment } from '../controllers/Comment.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const CommentRoute = express.Router();

CommentRoute.delete('/delete/:commentId',authenticate,DeleteComment)
CommentRoute.post('/add',authenticate, AddComment);
CommentRoute.get('/protected-all-comments',authenticate,ProtectedGetAllComment);

CommentRoute.get('/get-all-comment/:blogId',GetAllCommentByBlogId);
CommentRoute.get('/comment-count/:blogId',CommentCount);
CommentRoute.get('/all-comments',GetAllComment);
export default CommentRoute;