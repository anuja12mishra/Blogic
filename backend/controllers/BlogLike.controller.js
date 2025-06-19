import {
    handleError
} from "../helpers/handleError.js";
import BlogLike from "../models/blogLike.model.js";

export const SetLike = async (req, res, next) => {
    try {
        const {
            authorId,
            blogId,
        } = req.body;

        // Validate required fields with detailed logging
        if (!authorId) {
            console.log('ERROR: authorId is missing or falsy');
            return next(handleError(400, "Author ID is required"));
        }

        if (!blogId) {
            console.log('ERROR: blogId is missing or falsy');
            return next(handleError(400, "Blog ID is required"));
        }


        const isLiked = await BlogLike.findOne({
            authorId,
            blogId
        });

        if (isLiked) {
            await BlogLike.findOneAndDelete({
                authorId,
                blogId
            });
        } else {
            const newBlogLike = new BlogLike({
                authorId,
                blogId
            });
            await newBlogLike.save();
        }


        const likeCount = await BlogLike.countDocuments({
            blogId
        });
        res.status(201).json({
            success: true,
            like: likeCount
        });
    } catch (error) {
        console.error('SetLike error:', error.message);
        next(handleError(500, error.message));
    }
};

export const GetLikeCount = async (req, res, next) => {
    try {
        const {
            blogId,
            authorId
        } = req.params;
        // console.log('req.params', req.params)
        const likeCount = await BlogLike.countDocuments({
            blogId
        });

        let isUserLiked = false
        if (authorId) {
            isUserLiked = await BlogLike.exists({
                authorId,
                blogId
            })
        }
        res.status(201).json({
            success: true,
            like: likeCount,
            isLiked:Boolean(isUserLiked)
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};