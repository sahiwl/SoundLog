import * as userService from "../services/user.service.js";

const followUser = async (req, res) => {
    const result = await userService.followUser(req.user.id, req.params.id);
    res.status(200).json(result);
};

const unfollowUser = async (req, res) => {
    const result = await userService.unfollowUser(req.user.id, req.params.id);
    res.status(200).json(result);
};

const getUserProfile = async (req, res) => {
    const user = await userService.getUserProfile(req.userId);
    res.status(200).json(user);
};

export { followUser, unfollowUser, getUserProfile };
