import { Request, Response, NextFunction } from "express";
import { handleError } from "../helpers/handleError.js";
import Blog from '../models/blog.model.js';
import Category from '../models/category.model.js';
import { deleteFromR2, uploadToR2 } from '../helpers/r2Upload.js';
import { encode } from 'entities';
import { deleteBlogWithRelatedData } from "../helpers/DeleteRelatedBlog.js";
import main from "../config/gemini.js";

export const AddBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, title, category, slug, blogContent } = req.body;

        if (!title || !category || !blogContent) {
            return next(handleError(400, 'Title, category, and content are required'));
        }

        let uploadResult;
        try {
            uploadResult = await uploadToR2((req as any).file, 'featuredImage');
        } catch (uploadError: any) {
            return next(handleError(500, `File upload failed: ${uploadError.message}`));
        }

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

    } catch (error: any) {
        console.error('AddBlog error:', error);
        next(handleError(500, error.message));
    }
};

export const EditBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogId } = req.params;
        const isBlogExist = await Blog.findById(blogId);

        if (!isBlogExist) {
            return next(handleError(400, 'Blog not found'));
        }

        const { author, title, category, slug, blogContent } = req.body;
        const file = (req as any).file;

        if (!title || !category || !blogContent) {
            return next(handleError(400, 'Title, category, and content are required'));
        }

        const oldAvatarKey = isBlogExist.featuredImageKey;
        let uploadResult;

        if (file) {
            try {
                uploadResult = await uploadToR2(file, 'featuredImage');
                if (oldAvatarKey) {
                    try {
                        await deleteFromR2(oldAvatarKey);
                    } catch (deleteError: any) {
                        console.error('Error deleting old avatar:', deleteError.message);
                    }
                }
            } catch (uploadError: any) {
                return next(handleError(500, `File upload failed: ${uploadError.message}`));
            }
        }

        isBlogExist.author = author || isBlogExist.author;
        isBlogExist.category = category;
        isBlogExist.title = title;
        isBlogExist.slug = slug || isBlogExist.slug;
        isBlogExist.blogContent = encode(blogContent);

        if (file && uploadResult) {
            isBlogExist.featuredImage = uploadResult.url;
            isBlogExist.featuredImageKey = uploadResult.key;
        }

        await isBlogExist.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: isBlogExist
        });

    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const GetAllBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allBlogs = await Blog.find()
            .populate('author', 'name avatar role username')
            .populate('category', 'name slug')
            .sort({ updatedAt: -1 })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            message: "Blogs retrieved successfully",
            blog: allBlogs
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const GetAllBlogProtect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        let allBlogs;
        if (user.role === 'admin') {
            allBlogs = await Blog.find()
                .populate('author', 'name avatar role username')
                .populate('category', 'name slug')
                .sort({ updatedAt: -1 })
                .lean()
                .exec();
        } else {
            allBlogs = await Blog.find({ author: user._id })
                .populate('author', 'name avatar role username')
                .populate('category', 'name slug')
                .sort({ updatedAt: -1 })
                .lean()
                .exec();
        }

        res.status(200).json({
            success: true,
            message: "Blogs retrieved successfully",
            blog: allBlogs
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const GetABlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogId } = req.params;
        const { skipViewIncrement } = req.query;

        const blog = await Blog.findById(blogId)
            .populate('author', 'name avatar role username')
            .populate('category', 'name');

        if (!blog) {
            return next(handleError(404, 'blog not found'));
        }

        if (skipViewIncrement !== 'true') {
            blog.views = (blog.views || 0) + 1;
            await blog.save();
        }

        res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
            blog: blog.toObject()
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const DeleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogId } = req.params;
        const result = await deleteBlogWithRelatedData(blogId as string);

        if (!result.success) {
            return next(handleError(404, result.message || 'Failed to delete blog'));
        }

        res.status(200).json({
            success: true,
            message: 'Blog and all related data deleted successfully'
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const GetBlogByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, blog } = req.params;
        const relatedBlogs = await Blog.find({ category: category, slug: { $ne: blog } }).lean().exec();

        if (!relatedBlogs) {
            return next(handleError(404, 'Category data not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Related Blogs fetched successfully',
            blog: relatedBlogs
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const GetBlogByCategoryOnly = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category } = req.params;
        const categoryData = await Category.findOne({ slug: category });

        if (!categoryData) {
            return next(handleError(404, 'This Category data not found'));
        }
        const categoryId = categoryData._id;

        const blog = await Blog.find({ category: categoryId })
            .populate('author', 'name avatar role username')
            .populate('category', 'name slug')
            .sort({ updatedAt: -1 })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            message: 'Related Blogs fetched successfully',
            blog: blog,
            category: categoryData
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const Search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const q = req.query.q as string;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
                blog: []
            });
        }

        const blog = await Blog.find({
            $or: [
                { title: { $regex: q.trim(), $options: 'i' } },
                { blogContent: { $regex: q.trim(), $options: 'i' } },
                { slug: { $regex: q.trim(), $options: 'i' } }
            ]
        })
            .populate('author', 'name avatar role username')
            .populate('category', 'name slug')
            .sort({ title: 1 })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            message: `Found ${blog.length} blog(s) for "${q}"`,
            blog: blog,
            query: q
        });
    } catch (error: any) {
        console.error('Error in Search:', error);
        next(handleError(500, error.message));
    }
};

export const GenerateContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing. Make sure to send JSON data.'
            });
        }

        const { title, body } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Title is required to generate blog content'
            });
        }

        const prompt = `Create a comprehensive, SEO-optimized blog post with the following specifications:
        BLOG DETAILS:
        Title: "${title.trim()}"
        Additional Context: ${body || 'None provided'}
        ... (rest of the prompt) ...`;

        const content = await main(prompt);

        if (!content || content.trim().length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate content. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            content: content.trim(),
            message: 'Blog content generated successfully'
        });

    } catch (error: any) {
        console.error('Error in GenerateContent:', error);
        next(handleError(500, error.message));
    }
};

export const UploadContentImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!(req as any).file) {
            return next(handleError(400, 'No image file provided'));
        }

        const uploadResult = await uploadToR2((req as any).file, 'content-images');

        res.status(200).json({
            success: true,
            url: uploadResult.url,
            message: 'Image uploaded successfully'
        });
    } catch (error: any) {
        console.error('UploadContentImage error:', error);
        next(handleError(500, `Image upload failed: ${error.message}`));
    }
};
