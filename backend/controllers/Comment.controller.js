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
            console.log('ERROR: authorId is missing or falsy');
            return next(handleError(400, "Author ID is required"));
        }
        
        if (!blogId) {
            console.log('ERROR: blogId is missing or falsy');
            return next(handleError(400, "Blog ID is required"));
        }
        
        if (!comment) {
            console.log('ERROR: comment is missing or falsy');
            return next(handleError(400, "Comment is required"));
        }

        // Validate comment content is not empty after trimming
        if (!comment.trim()) {
            console.log('ERROR: comment is empty after trimming');
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
// export const DeleteComment = async (req, res, next) => {
//     try {
//         const { categoryId } = req.params;

//         const existingCategory = await Category.findById(categoryId);

//         if (!existingCategory) {
//             return next(handleError(404, 'Category not found'));
//         }

//         const name = existingCategory.name;
//         await Category.findByIdAndDelete(categoryId);

//         return res.status(200).json({
//             success: true,
//             message: `Category '${name}' deleted successfully.`
//         });
//     } catch (error) {
//         console.error("Error in DeleteCategory:", error);
//         return next(handleError(500, "Internal Server Error"));
//     }
// };


// export const GetAllComment = async (req, res, next) => {
//     try {
//         const categories = await Category.find({}).sort({name:1}).lean().exec();
//         res.status(200).json({
//             success: true,
//             message: "Categories retrieved successfully",
//             categories: categories
//         });
//     } catch (error) {
//         console.error(error.message);
//         next(handleError(500, error.message));
//     }
// };