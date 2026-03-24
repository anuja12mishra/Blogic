import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlogLike extends Document {
    blogId: Types.ObjectId;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BlogLikeSchema = new Schema<IBlogLike>({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const BlogLike = mongoose.model<IBlogLike>('BlogLike', BlogLikeSchema, 'bloglikes');
export default BlogLike;
