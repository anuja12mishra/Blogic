import express from 'express';
import { AddComment, CommentCount, DeleteComment, GetAllComment, GetAllCommentByBlogId } from '../controllers/Comment.controller.js';

const CommentRoute = express.Router();

CommentRoute.post('/add', AddComment);
CommentRoute.get('/get-all-comment/:blogId',GetAllCommentByBlogId);
CommentRoute.get('/comment-count/:blogId',CommentCount);
CommentRoute.get('/all-comments',GetAllComment);
CommentRoute.delete('/delete/:commentId',DeleteComment)
export default CommentRoute;