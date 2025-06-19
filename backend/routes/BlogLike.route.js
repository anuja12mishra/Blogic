import express from 'express';
import { GetLikeCount, SetLike } from '../controllers/BlogLike.controller.js';

const BlogLikeRoute = express.Router();

BlogLikeRoute.post('/update-like', SetLike);
BlogLikeRoute.get('/like-count/:blogId', GetLikeCount);

export default BlogLikeRoute;