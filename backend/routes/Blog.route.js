import express from 'express';
import { AddBlog } from '../controllers/Blog.controller.js';
import upload from '../config/multer.config.js';

const BlogRoute = express.Router();

// Add the upload middleware before your controller
BlogRoute.post('/add', upload.single('featuredImage'), AddBlog);

export default BlogRoute;