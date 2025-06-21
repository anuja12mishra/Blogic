import { handleError } from "../helpers/handleError.js";
import BlogLike from "../models/blogLike.model.js";
export const SetLike = async (req, res, next) => {
    try {
        const { authorId, blogId, action } = req.body;

        if (!authorId) return next(handleError(400, "Author ID is required"));
        if (!blogId) return next(handleError(400, "Blog ID is required"));

        let isLiked = false;

        if (action === 'like') {
            const existingLike = await BlogLike.findOne({ authorId, blogId });
            if (!existingLike) {
                await new BlogLike({ authorId, blogId }).save();
                isLiked = true;
            }
        } else if (action === 'unlike') {
            await BlogLike.findOneAndDelete({ authorId, blogId });
            isLiked = false;
        } else {
            return next(handleError(400, "Invalid action"));
        }

        const likeCount = await BlogLike.countDocuments({ blogId });

        res.status(200).json({
            success: true,
            like: likeCount,
            isLiked
        });

    } catch (error) {
        console.error('SetLike error:', error.message);
        next(handleError(500, error.message));
    }
};

// export const SetLike = async (req, res, next) => {
//     try {
//         const { authorId, blogId } = req.body;

//         // Validate required fields
//         if (!authorId) {
//             console.log('ERROR: authorId is missing or falsy');
//             return next(handleError(400, "Author ID is required"));
//         }

//         if (!blogId) {
//             console.log('ERROR: blogId is missing or falsy');
//             return next(handleError(400, "Blog ID is required"));
//         }

//         // Use findOneAndDelete to get the deleted document (if any)
//         const deletedLike = await BlogLike.findOneAndDelete({
//             authorId,
//             blogId
//         });

//         let isLiked = false;
        
//         // If no like was deleted, create a new one
//         if (!deletedLike) {
//             const newBlogLike = new BlogLike({
//                 authorId,
//                 blogId
//             });
//             await newBlogLike.save();
//             isLiked = true;
//         }

//         // Get updated like count
//         const likeCount = await BlogLike.countDocuments({ blogId });
        
//         res.status(200).json({
//             success: true,
//             like: likeCount,
//             isLiked: isLiked
//         });
//     } catch (error) {
//         console.error('SetLike error:', error.message);
//         next(handleError(500, error.message));
//     }
// };

export const GetLikeCount = async (req, res, next) => {
    try {
        const { blogId, authorId } = req.params;
        
        const likeCount = await BlogLike.countDocuments({ blogId });

        let isUserLiked = false;
        if (authorId && authorId !== 'undefined' && authorId !== 'null') {
            isUserLiked = await BlogLike.exists({
                authorId,
                blogId
            });
        }
        
        res.status(200).json({
            success: true,
            like: likeCount,
            isLiked: Boolean(isUserLiked)
        });
    } catch (error) {
        console.error('GetLikeCount error:', error.message);
        next(handleError(500, error.message));
    }
};



// import {
//     handleError
// } from "../helpers/handleError.js";
// import BlogLike from "../models/blogLike.model.js";

// export const SetLike = async (req, res, next) => {
//     try {
//         const {
//             authorId,
//             blogId,
//         } = req.body;

//         // Validate required fields with detailed logging
//         if (!authorId) {
//             console.log('ERROR: authorId is missing or falsy');
//             return next(handleError(400, "Author ID is required"));
//         }

//         if (!blogId) {
//             console.log('ERROR: blogId is missing or falsy');
//             return next(handleError(400, "Blog ID is required"));
//         }

//         const isLiked = await BlogLike.findOne({
//             authorId,
//             blogId
//         });

//         if (isLiked) {
//             await BlogLike.findOneAndDelete({
//                 authorId,
//                 blogId
//             });
//         } else {
//             const newBlogLike = new BlogLike({
//                 authorId,
//                 blogId
//             });
//             await newBlogLike.save();
//         }


//         const likeCount = await BlogLike.countDocuments({
//             blogId
//         });
//         res.status(201).json({
//             success: true,
//             like: likeCount
//         });
//     } catch (error) {
//         console.error('SetLike error:', error.message);
//         next(handleError(500, error.message));
//     }
// };
// In your like.controller.js
// export const SetLike = async (req, res, next) => {
//     try {
//         const { authorId, blogId } = req.body;

//         // More detailed validation
//         if (!mongoose.Types.ObjectId.isValid(authorId)) {
//             return next(handleError(400, "Invalid Author ID format"));
//         }

//         if (!mongoose.Types.ObjectId.isValid(blogId)) {
//             return next(handleError(400, "Invalid Blog ID format"));
//         }

//         // Check if the like exists
//         const existingLike = await BlogLike.findOne({ authorId, blogId });

//         if (existingLike) {
//             await BlogLike.deleteOne({ _id: existingLike._id });
//         } else {
//             await BlogLike.create({ authorId, blogId });
//         }

//         // Get updated count
//         const likeCount = await BlogLike.countDocuments({ blogId });

//         res.status(200).json({
//             success: true,
//             like: likeCount
//         });

//     } catch (error) {
//         console.error('SetLike error:', error);
//         next(handleError(500, "Failed to process like action"));
//     }
// };

// export const GetLikeCount = async (req, res, next) => {
//     try {
//         const {
//             blogId,
//             authorId
//         } = req.params;
//         // console.log('req.params', req.params)
//         const likeCount = await BlogLike.countDocuments({
//             blogId
//         });

//         let isUserLiked = false
//         if (authorId) {
//             isUserLiked = await BlogLike.exists({
//                 authorId,
//                 blogId
//             })
//         }
//         res.status(201).json({
//             success: true,
//             like: likeCount,
//             isLiked: Boolean(isUserLiked)
//         });
//     } catch (error) {
//         console.error(error.message);
//         next(handleError(500, error.message));
//     }
// };



// import { handleError } from "../helpers/handleError.js";
// import BlogLike from "../models/blogLike.model.js";
// import Blog from "../models/blog.model.js";

// export const SetLike = async (req, res, next) => {
//     try {
//         const { authorId, blogId } = req.body;

//         // Validate required fields
//         if (!authorId || !blogId) {
//             return next(handleError(400, "Both authorId and blogId are required"));
//         }

//         // Check if blog exists
//         const blog = await Blog.findById(blogId);
//         if (!blog) {
//             return next(handleError(404, "Blog not found"));
//         }

//         // Prevent users from liking their own blog
//         if (blog.author.toString() === authorId) {
//             return next(handleError(400, "You cannot like your own blog"));
//         }

//         // Check if like already exists
//         const existingLike = await BlogLike.findOne({ authorId, blogId });

//         if (existingLike) {
//             // Unlike if already liked
//             await BlogLike.findOneAndDelete({ authorId, blogId });
//         } else {
//             // Add new like
//             const newBlogLike = new BlogLike({ authorId, blogId });
//             await newBlogLike.save();
//         }

//         // Get updated like count
//         const likeCount = await BlogLike.countDocuments({ blogId });
        
//         res.status(200).json({
//             success: true,
//             likeCount,
//             isLiked: !existingLike // Returns true if new like, false if unlike
//         });

//     } catch (error) {
//         console.error('SetLike error:', error);
//         next(handleError(500, "Failed to process like"));
//     }
// };

// export const GetLikeCount = async (req, res, next) => {
//     try {
//         const { blogId } = req.params;
//         const { authorId } = req.query; // Optional

//         if (!blogId) {
//             return next(handleError(400, "Blog ID is required"));
//         }

//         // Check if blog exists
//         const blogExists = await Blog.exists({ _id: blogId });
//         if (!blogExists) {
//             return next(handleError(404, "Blog not found"));
//         }

//         const likeCount = await BlogLike.countDocuments({ blogId });
//         let isUserLiked = false;

//         if (authorId) {
//             isUserLiked = await BlogLike.exists({ authorId, blogId });
//         }

//         res.status(200).json({
//             success: true,
//             likeCount,
//             isLiked: isUserLiked
//         });

//     } catch (error) {
//         console.error('GetLikeCount error:', error);
//         next(handleError(500, "Failed to get like count"));
//     }
// };