import User from "../models/user.model.js";
import { AppError } from "../lib/AppError.js";

export const followUser = async (currentUserId, targetUserId) => {
    if (currentUserId === targetUserId) {
        throw new AppError("You cannot follow yourself.", 400);
    }

    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
        throw new AppError("Target user not found.", 404);
    }

    if (currUser.following.includes(targetUserId)) {
        throw new AppError("Already following this user.", 409);
    }

    currUser.following.push(targetUserId);
    tarUser.followers.push(currentUserId);

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully followed user." };
};

export const unfollowUser = async (currentUserId, targetUserId) => {
    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
        throw new AppError("Target user not found.", 404);
    }

    if (!currUser.following.includes(targetUserId)) {
        throw new AppError("You are not following this user.", 400);
    }

    currUser.following = currUser.following.filter(
        (id) => id.toString() !== targetUserId
    );

    tarUser.followers = tarUser.followers.filter(
        (id) => id.toString() !== currentUserId
    );

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully unfollowed user." };
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new AppError("User not found.", 404);
    }

    await user.populate("followers", "username");
    await user.populate("following", "username");

    return user;
};
