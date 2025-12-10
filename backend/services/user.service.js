import User from "../models/user.model.js";

export const followUser = async (currentUserId, targetUserId) => {
    if (currentUserId === targetUserId) {
        throw new Error("you cannot follow yourself.");
    }

    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
        throw new Error("Target User Not Found.");
    }

    if (currUser.following.includes(targetUserId)) {
        throw new Error("Already following this user");
    }

    currUser.following.push(targetUserId);
    tarUser.followers.push(currentUserId);

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully followed user." };
}

export const unfollowUser = async (currentUserId, targetUserId) => {
    const currUser = await User.findById(currentUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
        throw new Error("Target User Not Found.");
    }

    if (!currUser.following.includes(targetUserId)) {
        throw new Error("you are not following this user");
    }

    currUser.following = currUser.following.filter(
        (id) => id.toString() !== targetUserId
    );

    tarUser.followers = tarUser.followers.filter((id) => id.toString() !== currentUserId);

    await currUser.save();
    await tarUser.save();

    return { message: "Successfully unfollowed user." };
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }

    await user.populate("followers", "username");
    await user.populate("following", "username");

    return user;
};
