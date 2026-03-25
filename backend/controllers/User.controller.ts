import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Blog from '../models/blog.model.js';
import BlogLike from '../models/blogLike.model.js';
import Comment from '../models/comment.model.js';
import { handleError } from '../helpers/handleError.js';
import { uploadToR2, deleteFromR2 } from '../helpers/r2Upload.js';
import { deleteBlogWithRelatedData } from '../helpers/DeleteRelatedBlog.js';

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        let user: any = await User.findById(userId).lean().exec();

        if (!user) return next(handleError(404, "User not found"));

        if (!user.username) {
            const generatedUsername = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
            await User.findByIdAndUpdate(userId, { username: generatedUsername });
            user.username = generatedUsername;
        }

        delete user.password;

        res.status(200).json({
            success: true,
            message: "User data found",
            user
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password').lean().exec();
        
        if (!user) return next(handleError(404, "User not found"));

        const blogs = await Blog.find({ author: user._id })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            user,
            blogs
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const data = JSON.parse(req.body.user);
        const file = (req as any).file;

        let user = await User.findById(userId);
        if (!user) return next(handleError(404, "User not found"));

        const oldAvatarKey = user.avatarKey;
        user.name = data.name;
        user.bio = data.bio;

        if (file) {
            try {
                const uploadResult = await uploadToR2(file, 'avatars');
                user.avatar = uploadResult.url;
                user.avatarKey = uploadResult.key;

                if (oldAvatarKey) {
                    try {
                        await deleteFromR2(oldAvatarKey);
                    } catch (deleteError: any) {
                        console.error('Error deleting old avatar:', deleteError.message);
                    }
                }
            } catch (uploadError: any) {
                return next(handleError(500, `File upload failed: ${uploadError.message}`));
            }
        }

        user = await user.save();
        const userResponse = user.toObject() as any;
        delete userResponse.password;
        delete userResponse.avatarKey;

        res.status(200).json({
            success: true,
            message: "User data updated",
            user: userResponse
        });
    } catch (error: any) {
        console.error('Update user error:', error);
        next(handleError(500, error.message));
    }
};

export const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().sort({ createdAt: 1 }).lean().exec();
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "No Users are present",
            });
        }
        res.status(200).json({
            success: true,
            message: "User list found",
            user: users
        });
    } catch (error: any) {
        console.error('GetAllUsers error:', error);
        next(handleError(500, error.message));
    }
};

export const DeleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        if (!userId) return next(handleError(400, 'User ID is required'));

        const user = await User.findById(userId);
        if (!user) return next(handleError(404, 'User not found'));

        const userName = user.name;
        const userBlogs = await Blog.find({ author: userId });

        const blogDeletionPromises = userBlogs.map((blog: any) => 
            deleteBlogWithRelatedData(blog._id.toString())
        );

        await Promise.all(blogDeletionPromises);

        try {
            await Comment.deleteMany({ authorId: userId });
        } catch (commentError) {
            console.error(`Failed to delete comments by user: ${userId}`, commentError);
        }

        try {
            await BlogLike.deleteMany({ userId: userId });
        } catch (likeError) {
            console.error(`Failed to delete likes by user: ${userId}`, likeError);
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: `User '${userName}' and related data deleted successfully.`
        });
    } catch (error: any) {
        console.error('Delete user error:', error);
        next(handleError(500, error.message));
    }
};

export const getUserAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const totalViewsResult = await Blog.aggregate([
            { $match: { author: new mongoose.Types.ObjectId(userId as string) } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);
        const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

        const userBlogs = await Blog.find({ author: userId }).select('_id');
        const blogIds = userBlogs.map(blog => blog._id);

        const totalLikes = await BlogLike.countDocuments({ blogId: { $in: blogIds } });

        const topViewedBlogs = await Blog.find({ author: userId })
            .populate('category', 'slug')
            .sort({ views: -1 })
            .limit(5)
            .select('title views slug category');

        const topLikedBlogsResult = await BlogLike.aggregate([
            { $match: { blogId: { $in: blogIds } } },
            { $group: { _id: "$blogId", likeCount: { $sum: 1 } } },
            { $sort: { likeCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'blogs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'blogDetails'
                }
            },
            { $unwind: "$blogDetails" },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'blogDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    _id: 1,
                    likeCount: 1,
                    title: "$blogDetails.title",
                    slug: "$blogDetails.slug",
                    categorySlug: "$categoryDetails.slug"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                totalViews,
                totalLikes,
                topViewedBlogs,
                topLikedBlogs: topLikedBlogsResult
            }
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};
