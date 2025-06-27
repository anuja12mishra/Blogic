import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
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

const Blog = mongoose.model('Blog', BlogSchema, 'blogs');
export default Blog;