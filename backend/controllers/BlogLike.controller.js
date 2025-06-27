import mongoose from "mongoose";
import {
    handleError
} from "../helpers/handleError.js";
import BlogLike from "../models/blogLike.model.js";
export const SetLike = async (req, res, next) => {
    try {
        const {
            authorId,
            blogId,
            action
        } = req.body;

        if (!authorId) return next(handleError(400, "Author ID is required"));
        if (!blogId) return next(handleError(400, "Blog ID is required"));

        let isLiked = false;

        if (action === 'like') {
            const existingLike = await BlogLike.findOne({
                authorId,
                blogId
            });
            if (!existingLike) {
                await new BlogLike({
                    authorId,
                    blogId
                }).save();
                isLiked = true;
            }
        } else if (action === 'unlike') {
            await BlogLike.findOneAndDelete({
                authorId,
                blogId
            });
            isLiked = false;
        } else {
            return next(handleError(400, "Invalid action"));
        }

        const likeCount = await BlogLike.countDocuments({
            blogId
        });

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
        const {
            blogId,
            authorId
        } = req.params;

        const likeCount = await BlogLike.countDocuments({
            blogId
        });

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

export const GetAllLikesByBlog = async (req, res, next) => {
    try {

        const {
            blogId
        } = req.params;

        if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
            return next(handleError(400, "Valid Blog ID is required"));
        }

        const allLikes = await BlogLike.find({
            blogId: blogId
        }).populate('authorId', 'name').lean().exec();

        res.status(200).json({
            success: true,
            like: allLikes
        });
    } catch (error) {
        console.error('GetAllLikesByBlog error:', error.message);
        next(handleError(500, error.message));
    }
}

export const ProtectedGetAllLike = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return next(handleError(401, "User authentication required"));
        }
        let allLikes;
        if (user.role === 'admin') {
            allLikes = await BlogLike.find()
                .populate('authorId', 'name email')
                .populate({
                    path: 'blogId',
                    select: 'title author createdAt',
                    populate: {
                        path: 'author',
                        select: 'name email'
                    }
                })
                .lean().exec();
        } else {
            allLikes = await BlogLike.find({
                authorId: user._id
            }).populate('authorId', 'name email').populate('blogId', 'author title').lean().exec();
        }
        res.status(200).json({
            success: true,
            message: "Likes retrieved successfully",
            like: allLikes
        });
    } catch (error) {
        console.error('ProtectedGetAllLike error:', error.message);
        next(handleError(500, error.message));
    }
}

export const DeleteLike = async (req, res, next) => {
    try {
        const {
            likeId
        } = req.params;
        if (!likeId) {
            return next(handleError(404, 'Like not found'));
        }
        await BlogLike.findByIdAndDelete(likeId);
        return res.status(200).json({
            success: true,
            message: `like deleted successfully.`
        });
    } catch (error) {
        console.error("DeleteLike:", error);
        return next(handleError(500, "Internal Server Error"));
    }
};