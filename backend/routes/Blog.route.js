import express from 'express';
import {
    AddBlog,
    DeleteBlog,
    EditBlog,
    GenerateContent,
    GetABlog,
    GetAllBlog,
    GetAllBlogProtect,
    GetBlogByCategory,
    GetBlogByCategoryOnly,
    Search
} from '../controllers/Blog.controller.js';
import upload from '../config/multer.config.js';
import { authenticate } from '../middleware/authenticate.js';

const BlogRoute = express.Router();

// Add the upload middleware before your controller
BlogRoute.post('/add',authenticate, upload.single('featuredImage'), AddBlog);
BlogRoute.put('/edit/:blogId',authenticate, upload.single('featuredImage'), EditBlog);
BlogRoute.delete('/delete/:blogId',authenticate, DeleteBlog);
BlogRoute.get('/protect-get-all-blogs',authenticate,GetAllBlogProtect);
BlogRoute.post('/genrate-content', authenticate, GenerateContent);


BlogRoute.get('/get-a-blog/:blogId', GetABlog);
BlogRoute.get('/get-all-blogs', GetAllBlog);
BlogRoute.get('/get-blog-by-category/:category/:blog', GetBlogByCategory)
BlogRoute.get('/get-blog-by-category-only/:category', GetBlogByCategoryOnly);
BlogRoute.get('/search', Search);


export default BlogRoute;