import Blog from '../models/blog.model.js'
import BlogLike from '../models/blogLike.model.js'
import Comment from '../models/comment.model.js';
import { deleteFromR2 } from './r2Upload.js';
export const deleteRelatedBlogData = async (blogId) => {
    try {
        // Delete all likes for this blog
        await BlogLike.deleteMany({ blogId: blogId });
        
        // Delete all comments for this blog
        await Comment.deleteMany({ blogId: blogId });
        
        // console.log(`Successfully deleted likes and comments for blog: ${blogId}`);
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete related data for blog: ${blogId}`, error);
        return { success: false, error };
    }
};

// Helper function to delete a single blog with its related data and images
export const deleteBlogWithRelatedData = async (blogId) => {
    try {
        const blog = await Blog.findById(blogId);
        
        if (!blog) {
            return { success: false, message: 'Blog not found' };
        }

        // Delete featured image from R2 if exists
        if (blog.featuredImageKey) {
            try {
                await deleteFromR2(blog.featuredImageKey);
                // console.log(`Successfully deleted image from R2: ${blog.featuredImageKey}`);
            } catch (r2Error) {
                console.error(`Failed to delete image from R2: ${blog.featuredImageKey}`, r2Error);
            }
        }

        // Delete related comments and likes
        await deleteRelatedBlogData(blogId);

        // Delete the blog itself
        await Blog.findByIdAndDelete(blogId);

        return { success: true };
    } catch (error) {
        console.error(`Error deleting blog ${blogId}:`, error);
        return { success: false, error };
    }
};
