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
import {
    deleteBlogWithRelatedData
} from "../helpers/DeleteRelatedBlog.js";
import main from "../config/gemini.js";
export const AddBlog = async (req, res, next) => {
    try {
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

export const GetAllBlogProtect = async (req, res, next) => {
    try {
        const user = req.user;

        let allBlogs;
        if (user.role === 'admin') {
            allBlogs = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({
                updatedAt: -1
            }).lean().exec();
        } else {
            allBlogs = await Blog.find({
                author: user._id
            }).populate('author', 'name avatar role').populate('category', 'name slug').sort({
                updatedAt: -1
            }).lean().exec();
        }

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
        const { blogId } = req.params;
        const { skipViewIncrement } = req.query;
        
        const blog = await Blog.findById(blogId)
            .populate('author', 'name avatar role')
            .populate('category', 'name');
            
        if (!blog) {
            return next(handleError(404, 'blog not found'));
        }

        // Only increment views if skipViewIncrement is not true
        if (skipViewIncrement !== 'true') {
            blog.views = (blog.views || 0) + 1;
            await blog.save();
        }

        res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
            blog: blog.toObject()
        });

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

        const result = await deleteBlogWithRelatedData(blogId);

        if (!result.success) {
            // return res.status(404).json({
            //     success: false,
            //     message: result.message || 'Failed to delete blog'
            // });
            next(404, result.message || 'Failed to delete blog')
        }

        res.status(200).json({
            success: true,
            message: 'Blog and all related data deleted successfully'
        });

    } catch (error) {
        // console.error('Error in DeleteBlog:', error);
        // res.status(500).json({
        //     success: false,
        //     message: 'Internal server error',
        //     error: error.message
        // });
        console.error(error.message);
        next(handleError(500, error.message));
    }
};


export const GetBlogByCategory = async (req, res, next) => {
    try {
        const {
            category,
            blog
        } = req.params;

        const relatedBlogs = await Blog.find({
            category: category,
            slug: {
                $ne: blog
            }
        }).lean().exec();

        if (!relatedBlogs) {
            next(handleError(404, 'Category data not found'))
        }

        res.status(200).json({
            success: true,
            message: 'Related Blogs fetched successfully',
            blog: relatedBlogs
        });

    } catch (error) {
        console.error('Error in DeleteBlog:', error);
        next(handleError(500, error.message));
    }
}

export const GetBlogByCategoryOnly = async (req, res, next) => {
    try {
        //here the category getting from param is the slug of that category
        const {
            category
        } = req.params;
        //  ('category',category);

        const categoryData = await Category.findOne({
            slug: category
        });
        // console.log('categoryData', categoryData)
        if (!categoryData) {
            next(handleError(404, 'This Category data not found'))
        }
        const categoryId = categoryData._id;

        const blog = await Blog.find({
            category: categoryId
        }).populate('author', 'name avatar role').populate('category', 'name slug').sort({
            updatedAt: -1
        }).lean().exec();

        res.status(200).json({
            success: true,
            message: 'Related Blogs fetched successfully',
            blog: blog,
            category: categoryData
        });

    } catch (error) {
        console.error('Error in DeleteBlog:', error);
        next(handleError(500, error.message));
    }
}

export const Search = async (req, res, next) => {
    try {
        // Use req.query instead of req.params for query parameters
        const {
            q
        } = req.query;

        // Validate that search query exists
        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
                blog: []
            });
        }

        // Fixed: $options instead of $option, and added search in content as well
        const blog = await Blog.find({
                $or: [{
                        title: {
                            $regex: q.trim(),
                            $options: 'i'
                        }
                    },
                    {
                        blogContent: {
                            $regex: q.trim(),
                            $options: 'i'
                        }
                    },
                    {
                        slug: {
                            $regex: q.trim(),
                            $options: 'i'
                        }
                    }
                ]
            })
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .sort({
                title: 1
            })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            message: `Found ${blog.length} blog(s) for "${q}"`,
            blog: blog,
            query: q
        });

    } catch (error) {
        console.error('Error in Search:', error);
        next(handleError(500, error.message));
    }
}

export const GenerateContent = async (req, res, next) => {
    try {
        // Debug: Log the request body to see what's being received
        // console.log('Request body:', req.body);
        // console.log('Content-Type:', req.headers['content-type']);
        
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing. Make sure to send JSON data.'
            });
        }

        // Extract title and category from request body (sent from frontend)
        const { title,body } = req.body;
        
        // Validate required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Title is required to generate blog content'
            });
        }


        // Create a comprehensive prompt for better content generation
        const prompt = `Create a comprehensive, SEO-optimized blog post with the following specifications:

        BLOG DETAILS:
        Title: "${title.trim()}"
        Additional Context: ${body || 'None provided'}

        CONTENT REQUIREMENTS:
        - Word Count: 400-800 words
        - Structure: Introduction (2-3 paragraphs) + 4-6 main sections + Conclusion (2 paragraphs)
        - Tone: Professional, engaging, and conversational
        - Reading Level: Easy to understand for general audience
        - SEO Elements: Include relevant keywords naturally throughout

        FORMATTING SPECIFICATIONS:
        - Use clear, descriptive H2 headings for main sections
        - Include H3 subheadings where appropriate
        - Write in short, scannable paragraphs (2-4 sentences each)
        - Add bullet points or numbered lists for better readability
        - Include transitional phrases between sections

        CONTENT QUALITY STANDARDS:
        - Provide actionable insights and practical information
        - Include specific examples, statistics, or case studies when relevant
        - Address common questions or pain points related to the topic
        - Ensure factual accuracy and cite credible sources when needed
        - Make content valuable and shareable

        WRITING STYLE:
        - Hook readers with a compelling opening
        - Use active voice and strong verbs
        - Include rhetorical questions to engage readers
        - Vary sentence length for better flow
        - End with a strong call-to-action or key takeaway

        OUTPUT FORMAT:
        Return clean, formatted text ready for web publishing. Use simple HTML formatting:
        - Headings: <h2>Main Heading</h2>, <h3>Subheading</h3>
        - Paragraphs: <p>Content here</p>
        - Lists: <ul><li>Item</li></ul> or <ol><li>Item</li></ol>
        - Bold text: <strong>important text</strong>
        - Italic text: <em>emphasized text</em>


        Do not include meta descriptions, tags, or any prefatory text. Start directly with the blog content.`;

        // Call your AI function with the constructed prompt
        const content = await main(prompt);
        
        // Validate that content was generated
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

    } catch (error) {
        console.error('Error in GenerateContent:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to generate blog content';
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        // Handle different types of errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            errorMessage = 'AI service is currently unavailable. Please try again later.';
        } else if (error.response && error.response.status === 429) {
            errorMessage = 'AI service rate limit exceeded. Please try again in a few minutes.';
        } else if (error.response && error.response.status === 401) {
            errorMessage = 'AI service authentication failed. Please check configuration.';
        }
        
        next(handleError(500, errorMessage));
    }
}
