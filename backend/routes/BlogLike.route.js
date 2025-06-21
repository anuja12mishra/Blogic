import express from 'express';
import { GetLikeCount, SetLike } from '../controllers/BlogLike.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const BlogLikeRoute = express.Router();

// ✅ Accept authorId in params
BlogLikeRoute.get('/like-count/:blogId/:authorId', GetLikeCount);
BlogLikeRoute.post('/update-like',authenticate, SetLike);

export default BlogLikeRoute;
