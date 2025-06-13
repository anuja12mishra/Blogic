import User from '../models/user.model.js';
import { handleError } from '../helpers/handleError.js';

export const getUserDetails = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ _id: userId }).lean().exec();
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
        const { userId } = req.params;
        const data = JSON.parse(req.body.user);
        const file = req.file;

        let user = await User.findById(userId);
        if (!user) {
            return next(handleError(404, "User not found"));
        }

        // Update fields
        user.name = data.name;
        user.bio = data.bio;

        // Optional: update avatar if uploaded
        if (file) {
            user.avatar = file.filename; // or file.path depending on how you want to store
        }

        user = await user.save();

        // Do not send password
        user.password = undefined;
        console.log(user)

        res.status(200).json({
            success: true,
            message: "User data updated",
            user
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}
