import Blog from '../models/blog.model.js';
import BlogLike from '../models/blogLike.model.js';
import Comment from '../models/comment.model.js';
import { deleteFromR2 } from './r2Upload.js';

export const deleteRelatedBlogData = async (blogId: string) => {
    try {
        await BlogLike.deleteMany({ blogId: blogId });
        await Comment.deleteMany({ blogId: blogId });
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete related data for blog: ${blogId}`, error);
        return { success: false, error };
    }
};

export const deleteBlogWithRelatedData = async (blogId: string) => {
    try {
        const blog = await Blog.findById(blogId);
        
        if (!blog) {
            return { success: false, message: 'Blog not found' };
        }

        if (blog.featuredImageKey) {
            try {
                await deleteFromR2(blog.featuredImageKey);
            } catch (r2Error) {
                console.error(`Failed to delete image from R2: ${blog.featuredImageKey}`, r2Error);
            }
        }

        await deleteRelatedBlogData(blogId);
        await Blog.findByIdAndDelete(blogId);

        return { success: true };
    } catch (error) {
        console.error(`Error deleting blog ${blogId}:`, error);
        return { success: false, error };
    }
};
