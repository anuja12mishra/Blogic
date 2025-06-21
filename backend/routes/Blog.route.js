import express from 'express';
import { AddBlog, DeleteBlog, EditBlog, GetABlog, GetAllBlog, GetBlogByCategory, GetBlogByCategoryOnly } from '../controllers/Blog.controller.js';
import upload from '../config/multer.config.js';

const BlogRoute = express.Router();

// Add the upload middleware before your controller
BlogRoute.post('/add', upload.single('featuredImage'), AddBlog);
BlogRoute.put('/edit/:blogId',upload.single('featuredImage'),EditBlog);
BlogRoute.get('/get-a-blog/:blogId',GetABlog);
BlogRoute.get('/get-all-blogs',GetAllBlog);
BlogRoute.delete('/delete/:blogId',DeleteBlog);
BlogRoute.get('/get-blog-by-category/:category/:blog',GetBlogByCategory)
BlogRoute.get('/get-blog-by-category-only/:category',GetBlogByCategoryOnly);


export default BlogRoute;