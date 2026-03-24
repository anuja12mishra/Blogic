import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
    authorId: Types.ObjectId;
    blogId: Types.ObjectId;
    comment: string;
    parentId?: Types.ObjectId | null;
    likes: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', CommentSchema, 'comments');
export default Comment;
