import mongoose from "mongoose";

const BlogLikeSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    }
}, { timestamps: true });

// ✅ Prevent duplicate likes
BlogLikeSchema.index({ authorId: 1, blogId: 1 }, { unique: true });

const BlogLike = mongoose.model('BlogLike', BlogLikeSchema, 'bloglike');
export default BlogLike;
