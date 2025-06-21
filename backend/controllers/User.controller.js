import dotenv from 'dotenv';

dotenv.config()

import User from '../models/user.model.js';
import {
    handleError
} from '../helpers/handleError.js';
import {
    uploadToR2,
    deleteFromR2
} from '../helpers/r2Upload.js';

export const getUserDetails = async (req, res, next) => {
    try {
        const {
            userId
        } = req.params;
        const user = await User.findOne({
            _id: userId
        }).lean().exec();
        if (!user) {
            return next(handleError(404, "User not found"));
        }

        // Do not send password
        delete user.password;

        res.status(200).json({
            success: true,
            message: "User data found",
            user
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const updateUserDetails = async (req, res, next) => {
    try {
        const {
            userId
        } = req.params;
        const data = JSON.parse(req.body.user);
        const file = req.file;

        let user = await User.findById(userId);
        if (!user) {
            return next(handleError(404, "User not found"));
        }

        // Store old avatar key for deletion
        const oldAvatarKey = user.avatarKey;

        // Update fields
        user.name = data.name;
        user.bio = data.bio;

        // Optional: update avatar if uploaded
        if (file) {
            try {
                // console.log('Uploading file to R2:', {
                //     originalname: file.originalname,
                //     mimetype: file.mimetype,
                //     size: file.size
                // });

                // Upload new image to R2
                const uploadResult = await uploadToR2(file, 'avatars');

                user.avatar = uploadResult.url;
                user.avatarKey = uploadResult.key; // Store R2 key for future deletion

                //console.log('File uploaded successfully to R2:', uploadResult.url);

                // Delete old avatar from R2 if exists
                if (oldAvatarKey) {
                    try {
                        await deleteFromR2(oldAvatarKey);
                        //console.log('Old avatar deleted from R2:', oldAvatarKey);
                    } catch (deleteError) {
                        console.error('Error deleting old avatar:', deleteError.message);
                        // Don't fail the request if delete fails
                    }
                }

            } catch (uploadError) {
                // console.error('R2 upload error:', uploadError);
                return next(handleError(500, `File upload failed: ${uploadError.message}`));
            }
        }

        user = await user.save();

        // Do not send password and avatarKey
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.avatarKey;

        //console.log('User updated successfully:', user.name);

        res.status(200).json({
            success: true,
            message: "User data updated",
            user: userResponse
        });
    } catch (error) {
        console.error('Update user error:', error);
        next(handleError(500, error.message));
    }
}
export const GetAllUsers =async(req, res, next) => {
    try {
        const users = await User.find().sort({
            createdAt: 1
        }).lean().exec();
        if (!users) {
            res.status(404).json({
                success: false,
                message: "No Users are present",
            });
        }
        // console.log('users',users)
        res.status(200).json({
            success: true,
            message: "User data updated",
            user: users
        });
    } catch (error) {
        console.error('Update user error:', error);
        next(handleError(500, error.message));
    }
}

export const DeleteUser= async(req,res,next)=>{
    try {
        const {userId} = req.params;
         if (!userId) {
            return next(handleError(404, 'Category not found'));
        }

        const user = await User.findByIdAndDelete(userId);
        // console.log('User',user)

        return res.status(200).json({
            success: true,
            message: `User ${user.name} deleted successfully.`
        });
        
    } catch (error) {
        console.error('Update user error:', error);
        next(handleError(500, error.message));
    }
}


// trash >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//cloudinary setup ------>>>>>>>>>>>

// import User from '../models/user.model.js';
// import { handleError } from '../helpers/handleError.js';
// import cloudinary from '../config/cloudinary.config.js'; 


// export const getUserDetails = async (req, res, next) => {
//     try {
//         const { userId } = req.params;
//         const user = await User.findOne({ _id: userId }).lean().exec();
//         if (!user) {
//             return next(handleError(404, "User not found"));
//         }

//         // Do not send password
//         delete user.password;

//         res.status(200).json({
//             success: true,
//             message: "User data found",
//             user
//         });
//     } catch (error) {
//         next(handleError(500, error.message));
//     }
// }

// export const updateUserDetails = async (req, res, next) => {
//     try {
//         const { userId } = req.params;
//         const data = JSON.parse(req.body.user);
//         const file = req.file;

//         let user = await User.findById(userId);
//         if (!user) {
//             return next(handleError(404, "User not found"));
//         }

//         // Update fields
//         user.name = data.name;
//         user.bio = data.bio;

//         // Optional: update avatar if uploaded
//         if (file) {
//             // user.avatar = file.filename;
//             const uploadResult = await cloudinary.uploader
//             .upload(
//                 req.file.path,
//                 {
//                     folder:'blogic',
//                     resource_type:'auto'
//                 }
//             ).catch((error)=>{
//                 next(handleError(500,error.message));
//             })
//             user.avatar = uploadResult.secure_url;
//         }

//         user = await user.save();

//         // Do not send password
//         user.password = undefined;
//         // console.log(user)

//         res.status(200).json({
//             success: true,
//             message: "User data updated",
//             user
//         });
//     } catch (error) {
//         next(handleError(500, error.message));
//     }
// }