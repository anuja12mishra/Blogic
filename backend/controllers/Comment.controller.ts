import { Request, Response, NextFunction } from "express";
import { handleError } from "../helpers/handleError.js";
import Comment from "../models/comment.model.js";

export const AddComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorId, blogId, comment, parentId } = req.body;

        if (!authorId) return next(handleError(400, "Author ID is required"));
        if (!blogId) return next(handleError(400, "Blog ID is required"));
        if (!comment || !comment.trim()) return next(handleError(400, "Comment is required"));

        const newComment = new Comment({
            authorId,
            blogId,
            comment: comment.trim(),
            parentId: parentId || null
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error: any) {
        console.error('AddComment error:', error.message);
        next(handleError(500, error.message));
    }
};

export const GetAllCommentByBlogId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogId } = req.params;
        const comments: any[] = await Comment.find({ blogId: blogId })
            .populate('authorId', 'avatar name username')
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        const processedComments = comments.map(c => ({
            ...c,
            likeCount: c.likes ? c.likes.length : 0
        }));

        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: processedComments
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const LikeComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const userId = (req as any).user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(handleError(404, 'Comment not found'));
        }

        const likeIndex = comment.likes.indexOf(userId);
        if (likeIndex === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(likeIndex, 1);
        }

        await comment.save();

        res.status(200).json({
            success: true,
            message: likeIndex === -1 ? "Liked" : "Unliked",
            likeCount: comment.likes.length,
            isLiked: likeIndex === -1
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const CommentCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogId } = req.params;
        const comment = (await Comment.find({ blogId: blogId })).length;
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comment
        });
    } catch (error: any) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const GetAllComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await Comment.find()
            .populate('authorId', 'name username')
            .populate({
                path: 'blogId',
                select: 'title slug category',
                populate: {
                    path: 'category',
                    select: 'slug'
                }
            })
            .sort({ updatedAt: -1 })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comments
        });
    } catch (error: any) {
        console.error('GetAllComment', error.message);
        next(handleError(500, error.message));
    }
};

export const ProtectedGetAllComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        let comments;
        if (user.role === 'admin') {
            comments = await Comment.find()
                .populate('authorId', 'name username')
                .populate({
                    path: 'blogId',
                    select: 'title slug category',
                    populate: {
                        path: 'category',
                        select: 'slug'
                    }
                })
                .sort({ updatedAt: -1 })
                .lean()
                .exec();
        } else {
            comments = await Comment.find({ authorId: user._id })
                .populate('authorId', 'name username')
                .populate({
                    path: 'blogId',
                    select: 'title slug category',
                    populate: {
                        path: 'category',
                        select: 'slug'
                    }
                })
                .sort({ updatedAt: -1 })
                .lean()
                .exec();
        }
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comments
        });
    } catch (error: any) {
        console.error('ProtectedGetAllComment', error.message);
        next(handleError(500, error.message));
    }
};

export const UpdateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;

        if (!commentId) return next(handleError(400, "Comment ID is required"));
        if (!comment || !comment.trim()) return next(handleError(400, "Comment cannot be empty"));

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { comment: comment.trim() },
            { new: true }
        );

        if (!updatedComment) return next(handleError(404, "Comment not found"));

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: updatedComment
        });
    } catch (error: any) {
        console.error('UpdateComment error:', error.message);
        next(handleError(500, error.message));
    }
};

export const DeleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        if (!commentId) return next(handleError(404, 'Comment not found'));
        
        const comment = await Comment.findById(commentId);
        if (!comment) return next(handleError(404, 'Comment not found'));

        await Comment.findByIdAndDelete(commentId);
        await Comment.deleteMany({ parentId: commentId });

        return res.status(200).json({
            success: true,
            message: `Comment and its replies deleted successfully.`
        });
    } catch (error) {
        console.error("DeleteComment:", error);
        return next(handleError(500, "Internal Server Error"));
    }
};
