import express from 'express';
import { GetLikeCount, SetLike } from '../controllers/BlogLike.controller.js';

const BlogLikeRoute = express.Router();

// ✅ Accept authorId in params
BlogLikeRoute.get('/like-count/:blogId/:authorId', GetLikeCount);
BlogLikeRoute.post('/update-like', SetLike);

export default BlogLikeRoute;
