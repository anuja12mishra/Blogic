import express from 'express';
import { AddComment, CommentCount, DeleteComment, GetAllComment, GetAllCommentByBlogId, ProtectedGetAllComment, UpdateComment, LikeComment } from '../controllers/Comment.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const CommentRoute = express.Router();

CommentRoute.delete('/delete/:commentId', authenticate, DeleteComment);
CommentRoute.put('/update/:commentId', authenticate, UpdateComment);
CommentRoute.put('/like/:commentId', authenticate, LikeComment);
CommentRoute.post('/add', authenticate, AddComment);
CommentRoute.get('/protected-all-comments', authenticate, ProtectedGetAllComment);

CommentRoute.get('/get-all-comment/:blogId', GetAllCommentByBlogId);
CommentRoute.get('/comment-count/:blogId', CommentCount);
CommentRoute.get('/all-comments', GetAllComment);

export default CommentRoute;
