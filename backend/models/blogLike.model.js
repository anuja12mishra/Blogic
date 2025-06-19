import mongoose from "mongoose";

const BlogLikeSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Blog'
    },
},{timestamps:true})

const BlogLike = mongoose.model('BlogLike', BlogLikeSchema, 'bloglike');
export default BlogLike;