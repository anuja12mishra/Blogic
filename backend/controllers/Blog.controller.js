import {
    handleError
} from "../helpers/handleError.js";
import Blog from '../models/blog.model.js';
import Category from '../models/category.model.js'
import {
    deleteFromR2,
    uploadToR2
} from '../helpers/r2Upload.js';
import {
    encode
} from 'entities';
export const AddBlog = async (req, res, next) => {
    try {
        // Access form fields directly from req.body
        // console.log("Form data:", req.body);

        // Access uploaded file
        // console.log("Uploaded file:", req.file);

        const {
            author,
            title,
            category,
            slug,
            blogContent
        } = req.body;

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
        const {
            blogId
        } = req.params;

        // Find the blog by ID
        const isBlogExist = await Blog.findById(blogId);

        if (!isBlogExist) {
            return next(handleError(400, 'Blog not found'));
        }

        const {
            author,
            title,
            category,
            slug,
            blogContent
        } = req.body;
        const file = req.file;

        // console.log('body',req.body,'file',req.file);

        // Validate required fields
        if (!title || !category || !blogContent) {
            return next(handleError(400, 'Title, category, and content are required'));
        }

        const oldAvatarKey = isBlogExist.featuredImageKey;
        let uploadResult;

        // Only process file upload if a new file was provided
        if (file) {
            try {
                uploadResult = await uploadToR2(file, 'featuredImage');

                // Delete old image only after new image is successfully uploaded
                if (oldAvatarKey) {
                    try {
                        // Make sure you import deleteFromR2 function
                        await deleteFromR2(oldAvatarKey);
                    } catch (deleteError) {
                        console.error('Error deleting old avatar:', deleteError.message);
                        // Consider whether to continue or fail here
                    }
                }
            } catch (uploadError) {
                return next(handleError(500, `File upload failed: ${uploadError.message}`));
            }
        }

        // Update blog fields
        isBlogExist.author = author || isBlogExist.author;
        isBlogExist.category = category;
        isBlogExist.title = title;
        isBlogExist.slug = slug || isBlogExist.slug;
        isBlogExist.blogContent = encode(blogContent);

        // Only update image fields if new image was uploaded
        if (file && uploadResult) {
            isBlogExist.featuredImage = uploadResult.url;
            isBlogExist.featuredImageKey = uploadResult.key;
        }

        await isBlogExist.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: isBlogExist // Added the updated blog data
        });

    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
}


export const GetAllBlog = async (req, res, next) => {
    try {

        const allBlogs = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({
            updatedAt: -1
        }).lean().exec();

        // console.log('allBlogs',allBlogs)
        res.status(200).json({
            success: true,
            message: "Blogs retrieved successfully",
            blog: allBlogs
        });

    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
}
export const GetABlog = async (req, res, next) => {
    try {
        const {
            blogId
        } = req.params;
        const blog = await Blog.findById(blogId)
            .populate('author', 'name avatar')
            .populate('category', 'name')
            .lean();
        if (!blog) {
            return next(handleError(404, 'blog not found'));
        }

        // console.log('blog',blog)

        res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            blog: blog
        });

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

export const DeleteBlog = async (req, res, next) => {
    try {
        const {
            blogId
        } = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        if (blog.featuredImageKey) {
            try {
                await deleteFromR2(blog.featuredImageKey);
                console.log(`Successfully deleted image from R2: ${blog.featuredImageKey}`);
            } catch (r2Error) {
                console.error(`Failed to delete image from R2: ${blog.featuredImageKey}`, r2Error);
            }
        }

        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });

    } catch (error) {
        console.error('Error in DeleteBlog:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const GetBlogByCategory = async (req, res, next) => {
    try {
        const {
            category,
            blog
        } = req.params;

        const relatedBlogs = await Blog.find({
            category: category,
            slug:{$ne:blog}
        }).lean().exec();

        if (!relatedBlogs) {
            next(handleError(404,'Category data not found'))
        }

        res.status(200).json({
            success: true,
            message: 'Related Blogs fetched successfully',
            blog: relatedBlogs
        });

    } catch (error) {
        console.error('Error in DeleteBlog:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const GetBlogByCategoryOnly = async (req, res, next) => {
    try {
        //here the category getting from param is the slug of that category
        const {
            category
        } = req.params;
        // console.log('category',category);

        const categoryData = await Category.findOne({
            slug: category
        });
        console.log('categoryData',categoryData)
        if (!categoryData) {
            next(handleError(404,'This Category data not found'))
        }
        const categoryId = categoryData._id;

        const blog = await Blog.find({category:categoryId}).populate('author', 'name avatar role').populate('category', 'name slug').sort({
            updatedAt: -1
        }).lean().exec();
        console.log('blog',blog)
        res.status(200).json({
            success: true,
            message: 'Related Blogs fetched successfully',
            blog: blog,
            category:categoryData
        });

    } catch (error) {
        console.error('Error in DeleteBlog:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
