import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
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
    comment:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})

const Comment = mongoose.model('Comment', CommentSchema, 'comment');
export default Comment;