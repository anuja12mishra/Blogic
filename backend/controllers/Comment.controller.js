import {
    handleError
} from "../helpers/handleError.js";
import Comment from "../models/comment.model.js";

export const AddComment = async (req, res, next) => {
    try {
        const {
            authorId,
            blogId,
            comment
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
            comment: comment.trim()
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
        // console.log('blogId',blogId)
        const comments = await Comment.find({blogId:blogId}).populate('authorId', 'avatar name').sort({updatedAt:-1}).lean().exec();
        // console.log('comments',comments)
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comments
        });
    } catch (error) {
        console.error(error.message);
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
        const comments = await Comment.find().populate('authorId', 'name').populate('blogId','title').sort({updatedAt:-1}).lean().exec();
        // console.log('comments',comments)
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comments
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};


export const ProtectedGetAllComment = async (req, res, next) => {
    try {

        const user=req.user;
        let comments
        if(user.role ==='admin'){
            comments = await Comment.find().populate('authorId', 'name').populate('blogId','title').sort({updatedAt:-1}).lean().exec();
        }
        else{
            comments = await Comment.find({authorId:user._id}).populate('authorId', 'name').populate('blogId','title').sort({updatedAt:-1}).lean().exec();
        }
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comment: comments
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};


export const DeleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        // const existingCategory = await Comment.findById(categoryId);

        if (!commentId) {
            return next(handleError(404, 'Category not found'));
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: `Comment deleted successfully.`
        });
    } catch (error) {
        console.error("Error in DeleteCategory:", error);
        return next(handleError(500, "Internal Server Error"));
    }
};



// export const AddComment = async (req, res, next) => {
//     try {
//         const {
//             authorId,
//             blogId,
//             comment
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
        
//         if (!comment) {
//             console.log('ERROR: comment is missing or falsy');
//             return next(handleError(400, "Comment is required"));
//         }

//         // Validate comment content is not empty after trimming
//         if (!comment.trim()) {
//             console.log('ERROR: comment is empty after trimming');
//             return next(handleError(400, "Comment cannot be empty"));
//         }

//         const newComment = new Comment({
//             authorId,
//             blogId,
//             comment: comment.trim()
//         });

//         await newComment.save();

//         res.status(201).json({
//             success: true,
//             message: "Comment added successfully",
//             comment: newComment
//         });
//     } catch (error) {
//         console.error('AddComment error:', error.message);
//         next(handleError(500, error.message));
//     }
// };