import dotenv from 'dotenv';
dotenv.config()

import User from '../models/user.model.js';
import Blog from '../models/blog.model.js'
import BlogLike from '../models/blogLike.model.js';
import Comment from '../models/comment.model.js'
import {
    handleError
} from '../helpers/handleError.js';
import {
    uploadToR2,
    deleteFromR2
} from '../helpers/r2Upload.js';
import { deleteBlogWithRelatedData } from '../helpers/DeleteRelatedBlog.js';

export const getUserDetails = async (req, res, next) => {
    try {
        const {
            userId
        } = req.params;
        const user = await User.findOne({
            _id: userId
        }).lean().exec();
        if (!user) {
            return next(handleError(404, "User not found"));
        }

        // Do not send password
        delete user.password;

        res.status(200).json({
            success: true,
            message: "User data found",
            user
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const updateUserDetails = async (req, res, next) => {
    try {
        const {
            userId
        } = req.params;
        const data = JSON.parse(req.body.user);
        const file = req.file;

        let user = await User.findById(userId);
        if (!user) {
            return next(handleError(404, "User not found"));
        }

        // Store old avatar key for deletion
        const oldAvatarKey = user.avatarKey;

        // Update fields
        user.name = data.name;
        user.bio = data.bio;

        // Optional: update avatar if uploaded
        if (file) {
            try {
                // console.log('Uploading file to R2:', {
                //     originalname: file.originalname,
                //     mimetype: file.mimetype,
                //     size: file.size
                // });

                // Upload new image to R2
                const uploadResult = await uploadToR2(file, 'avatars');

                user.avatar = uploadResult.url;
                user.avatarKey = uploadResult.key; // Store R2 key for future deletion

                //console.log('File uploaded successfully to R2:', uploadResult.url);

                // Delete old avatar from R2 if exists
                if (oldAvatarKey) {
                    try {
                        await deleteFromR2(oldAvatarKey);
                        //console.log('Old avatar deleted from R2:', oldAvatarKey);
                    } catch (deleteError) {
                        console.error('Error deleting old avatar:', deleteError.message);
                        // Don't fail the request if delete fails
                    }
                }

            } catch (uploadError) {
                // console.error('R2 upload error:', uploadError);
                return next(handleError(500, `File upload failed: ${uploadError.message}`));
            }
        }

        user = await user.save();

        // Do not send password and avatarKey
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.avatarKey;

        //console.log('User updated successfully:', user.name);

        res.status(200).json({
            success: true,
            message: "User data updated",
            user: userResponse
        });
    } catch (error) {
        console.error('Update user error:', error);
        next(handleError(500, error.message));
    }
}
export const GetAllUsers =async(req, res, next) => {
    try {
        const users = await User.find().sort({
            createdAt: 1
        }).lean().exec();
        if (!users) {
            res.status(404).json({
                success: false,
                message: "No Users are present",
            });
        }
        // console.log('users',users)
        res.status(200).json({
            success: true,
            message: "User data updated",
            user: users
        });
    } catch (error) {
        console.error('Update user error:', error);
        next(handleError(500, error.message));
    }
}
// // Helper function to delete comments and likes for a specific blog
// export const deleteRelatedBlogData = async (blogId) => {
//     try {
//         // Delete all likes for this blog
//         await Like.deleteMany({ blog: blogId });
        
//         // Delete all comments for this blog
//         await Comment.deleteMany({ blog: blogId });
        
//         console.log(`Successfully deleted likes and comments for blog: ${blogId}`);
//         return { success: true };
//     } catch (error) {
//         console.error(`Failed to delete related data for blog: ${blogId}`, error);
//         return { success: false, error };
//     }
// };

// // Helper function to delete a single blog with its related data and images
// export const deleteBlogWithRelatedData = async (blogId) => {
//     try {
//         const blog = await Blog.findById(blogId);
        
//         if (!blog) {
//             return { success: false, message: 'Blog not found' };
//         }

//         // Delete featured image from R2 if exists
//         if (blog.featuredImageKey) {
//             try {
//                 await deleteFromR2(blog.featuredImageKey);
//                 console.log(`Successfully deleted image from R2: ${blog.featuredImageKey}`);
//             } catch (r2Error) {
//                 console.error(`Failed to delete image from R2: ${blog.featuredImageKey}`, r2Error);
//             }
//         }

//         // Delete related comments and likes
//         await deleteRelatedBlogData(blogId);

//         // Delete the blog itself
//         await Blog.findByIdAndDelete(blogId);

//         return { success: true };
//     } catch (error) {
//         console.error(`Error deleting blog ${blogId}:`, error);
//         return { success: false, error };
//     }
// };

// Updated DeleteBlog function
// export const DeleteBlog = async (req, res, next) => {
//     try {
//         const { blogId } = req.params;

//         const result = await deleteBlogWithRelatedData(blogId);

//         if (!result.success) {
//             return res.status(404).json({
//                 success: false,
//                 message: result.message || 'Failed to delete blog'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Blog and all related data deleted successfully'
//         });

//     } catch (error) {
//         console.error('Error in DeleteBlog:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };

// Updated DeleteCategory function
// export const DeleteCategory = async (req, res, next) => {
//     try {
//         const { categoryId } = req.params;

//         const existingCategory = await Category.findById(categoryId);

//         if (!existingCategory) {
//             return next(handleError(404, 'Category not found'));
//         }

//         const name = existingCategory.name;

//         // Find all blogs in this category
//         const blogsInCategory = await Blog.find({ category: categoryId });

//         // Delete each blog with its related data
//         const deletionPromises = blogsInCategory.map(blog => 
//             deleteBlogWithRelatedData(blog._id)
//         );

//         // Wait for all blog deletions to complete
//         const deletionResults = await Promise.all(deletionPromises);

//         // Log any failed deletions
//         const failedDeletions = deletionResults.filter(result => !result.success);
//         if (failedDeletions.length > 0) {
//             console.error(`Failed to delete ${failedDeletions.length} blogs when deleting category ${categoryId}`);
//         }

//         // Delete the category itself
//         await Category.findByIdAndDelete(categoryId);

//         return res.status(200).json({
//             success: true,
//             message: `Category '${name}' and ${blogsInCategory.length} related blog(s) deleted successfully.`
//         });

//     } catch (error) {
//         console.error("Error in DeleteCategory:", error);
//         return next(handleError(500, "Internal Server Error"));
//     }
// };

// Updated DeleteUser function
export const DeleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return next(handleError(400, 'User ID is required'));
        }

        // Find the user first to get their name
        const user = await User.findById(userId);
        
        if (!user) {
            return next(handleError(404, 'User not found'));
        }

        const userName = user.name;

        // Find all blogs created by this user
        const userBlogs = await Blog.find({ author: userId });

        // Delete each blog with its related data (comments, likes, images)
        const blogDeletionPromises = userBlogs.map(blog => 
            deleteBlogWithRelatedData(blog._id)
        );

        // Wait for all blog deletions to complete
        const blogDeletionResults = await Promise.all(blogDeletionPromises);

        // Log any failed blog deletions
        const failedBlogDeletions = blogDeletionResults.filter(result => !result.success);
        if (failedBlogDeletions.length > 0) {
            console.error(`Failed to delete ${failedBlogDeletions.length} blogs when deleting user ${userId}`);
        }

        // Delete all comments made by this user (on other blogs)
        try {
            await Comment.deleteMany({ author: userId });
            console.log(`Successfully deleted comments by user: ${userId}`);
        } catch (commentError) {
            console.error(`Failed to delete comments by user: ${userId}`, commentError);
        }

        // Delete all likes made by this user
        try {
            await BlogLike.deleteMany({ user: userId });
            console.log(`Successfully deleted likes by user: ${userId}`);
        } catch (likeError) {
            console.error(`Failed to delete likes by user: ${userId}`, likeError);
        }

        // Finally, delete the user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: `User '${userName}' and all related data (${userBlogs.length} blog(s), comments, and likes) deleted successfully.`
        });

    } catch (error) {
        console.error('Delete user error:', error);
        next(handleError(500, error.message));
    }
};
// export const DeleteUser= async(req,res,next)=>{
//     try {
//         const {userId} = req.params;
//          if (!userId) {
//             return next(handleError(404, 'Category not found'));
//         }

//         const user = await User.findByIdAndDelete(userId);
//         // console.log('User',user)

//         return res.status(200).json({
//             success: true,
//             message: `User ${user.name} deleted successfully.`
//         });
        
//     } catch (error) {
//         console.error('Update user error:', error);
//         next(handleError(500, error.message));
//     }
// }
