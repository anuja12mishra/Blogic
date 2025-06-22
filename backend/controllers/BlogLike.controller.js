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


