import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: '',
        trime: true
    },
    avatarKey: {
        type: String,
        default: '',
        trime: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema, 'users');
export default User;