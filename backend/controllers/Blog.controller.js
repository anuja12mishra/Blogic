import { handleError } from "../helpers/handleError.js";
import Blog from '../models/blog.model.js';
import { uploadToR2 } from '../helpers/r2Upload.js';
import {encode} from 'entities';
export const AddBlog = async (req, res, next) => {
    try {
        // Access form fields directly from req.body
        console.log("Form data:", req.body);
        
        // Access uploaded file
        console.log("Uploaded file:", req.file);

        const {author, title, category, slug, blogContent } = req.body;

        // Validate required fields
        if (!title || !category || !blogContent) {
            return next(handleError(400, 'Title, category, and content are required'));
        }

        // Upload image to R2
        let uploadResult;
        try {
            uploadResult = await uploadToR2(req.file, 'featuredImage');
        } catch (uploadError) {
            return next(handleError(500, `File upload failed: ${uploadError.message}`));
        }

        // Create and save blog
        const blog = new Blog({
            author,
            category,
            title,
            slug,
            blogContent: encode(blogContent),
            featuredImage: uploadResult.url,
            featuredImageKey: uploadResult.key
        });

        await blog.save();

        res.status(201).json({
            success: true,
            message: 'Blog added successfully',
            data: blog
        });

    } catch (error) {
        console.error('AddBlog error:', error);
        next(handleError(500, error.message));
    }
}



export const EditBlog = async (req, res, next) => {
    try {

    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
}
export const GetAllBlog = async (req, res, next) => {
    try {

    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
}
export const GetABlog = async (req, res, next) => {
    try {

    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
}
export const UpdateBlog = async (req, res, next) => {
    try {

    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
}