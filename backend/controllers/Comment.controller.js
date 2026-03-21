import {
    handleError
} from "../helpers/handleError.js";
import Comment from "../models/comment.model.js";

export const AddComment = async (req, res, next) => {
    try {
        const {
            authorId,
            blogId,
            comment,
            parentId
        } = req.body;


        // Validate required fields with detailed logging
        if (!authorId) {
            // console.log('ERROR: authorId is missing or falsy');
            return next(handleError(400, "Author ID is required"));
        }
        
        if (!blogId) {
            // console.log('ERROR: blogId is missing or falsy');
            return next(handleError(400, "Blog ID is required"));
        }
        
        if (!comment) {
            // console.log('ERROR: comment is missing or falsy');
            return next(handleError(400, "Comment is required"));
        }

        // Validate comment content is not empty after trimming
        if (!comment.trim()) {
            // console.log('ERROR: comment is empty after trimming');
            return next(handleError(400, "Comment cannot be empty"));
        }

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
    } catch (error) {
        console.error('AddComment error:', error.message);
        next(handleError(500, error.message));
    }
};

export const GetAllCommentByBlogId = async (req, res, next) => {
    try {
        const {blogId} = req.params;
        const comments = await Comment.find({blogId:blogId})
            .populate('authorId', 'avatar name')
            .sort({createdAt: -1}) // Newest first by default
            .lean()
            .exec();

        // Map comments to include likeCount
        const processedComments = comments.map(c => ({
            ...c,
            likeCount: c.likes ? c.likes.length : 0
        }));

        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: processedComments
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const LikeComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

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
            likes: comment.likes.length
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const CommentCount= async (req, res, next) => {
    try {
        const {blogId} = req.params;
        //console.log('blogId',blogId)
        const comment = (await Comment.find({blogId:blogId})).length;
        // console.log('comments',comments)
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comment
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};


export const GetAllComment = async (req, res, next) => {
    try {
        // console.log('blogId',blogId)
        const comments = await Comment.find()
            .populate('authorId', 'name')
            .populate({
                path: 'blogId',
                select: 'title slug category',
                populate: {
                    path: 'category',
                    select: 'slug'
                }
            })
            .sort({updatedAt:-1})
            .lean()
            .exec();
        // console.log('comments',comments)
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comments
        });
    } catch (error) {
        console.error('GetAllComment',error.message);
        next(handleError(500, error.message));
    }
};


export const ProtectedGetAllComment = async (req, res, next) => {
    try {

        const user=req.user;
        let comments
        if(user.role ==='admin'){
            comments = await Comment.find()
                .populate('authorId', 'name')
                .populate({
                    path: 'blogId',
                    select: 'title slug category',
                    populate: {
                        path: 'category',
                        select: 'slug'
                    }
                })
                .sort({updatedAt:-1})
                .lean()
                .exec();
        }
        else{
            comments = await Comment.find({authorId:user._id})
                .populate('authorId', 'name')
                .populate({
                    path: 'blogId',
                    select: 'title slug category',
                    populate: {
                        path: 'category',
                        select: 'slug'
                    }
                })
                .sort({updatedAt:-1})
                .lean()
                .exec();
        }
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comments
        });
    } catch (error) {
        console.error('ProtectedGetAllComment',error.message);
        next(handleError(500, error.message));
    }
};


export const UpdateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;

        if (!commentId) {
            return next(handleError(400, "Comment ID is required"));
        }

        if (!comment || !comment.trim()) {
            return next(handleError(400, "Comment cannot be empty"));
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { comment: comment.trim() },
            { new: true }
        );

        if (!updatedComment) {
            return next(handleError(404, "Comment not found"));
        }

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: updatedComment
        });
    } catch (error) {
        console.error('UpdateComment error:', error.message);
        next(handleError(500, error.message));
    }
};

export const DeleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            return next(handleError(404, 'Comment not found'));
        }
        
        // Find the comment first to check if it exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(handleError(404, 'Comment not found'));
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Also delete all replies if this is a parent comment
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
