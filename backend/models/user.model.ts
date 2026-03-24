import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    role: 'user' | 'admin';
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    avatarKey?: string;
    password?: string;
    username?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
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
        required: true,
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
        trim: true
    },
    avatarKey: {
        type: String,
        default: '',
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    }
},{timestamps:true})

const User = mongoose.model<IUser>('User', userSchema, 'users');
export default User;
