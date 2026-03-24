import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlog extends Document {
    author: Types.ObjectId;
    category: Types.ObjectId;
    title: string;
    views: number;
    slug: string;
    blogContent: string;
    featuredImage: string;
    featuredImageKey: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
    author:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    category:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'Category'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    views:{
        type:Number,
        required:true,
        default:0
    },
    slug: {
        type: String,
        trim: true,
        required: true,
    },
    blogContent:{
        type: String,
        trim: true,
        required: true,
    },
    featuredImage:{
        type: String,
        trim: true,
        required: true,
    },
    featuredImageKey:{
        type: String,
        trim: true,
        required: true,
    }
},{timestamps:true})

const Blog = mongoose.model<IBlog>('Blog', BlogSchema, 'blogs');
export default Blog;
