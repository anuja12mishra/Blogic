import express from 'express';
import { DeleteLike, GetAllLikesByBlog, GetLikeCount, ProtectedGetAllLike, SetLike } from '../controllers/BlogLike.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const BlogLikeRoute = express.Router();

BlogLikeRoute.get('/like-count/:blogId/:authorId', GetLikeCount);

BlogLikeRoute.post('/update-like',authenticate, SetLike);
BlogLikeRoute.get('/get-like-by-blog',authenticate,GetAllLikesByBlog)
BlogLikeRoute.get('/protected-get-likes',authenticate,ProtectedGetAllLike)
BlogLikeRoute.delete('/delete-like/:likeId',authenticate,DeleteLike)


export default BlogLikeRoute;
