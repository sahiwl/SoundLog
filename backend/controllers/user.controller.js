import * as userService from "../services/user.service.js";

const followUser = async (req, res) => {
  try {
    const currUserId = req.user.id; //current user id (from auth middleware)
    const targetUserId = req.params.id; //target user id passed as route param

    const result = await userService.followUser(currUserId, targetUserId);
    return res.status(200).json(result);

  } catch (error) {
    console.log("Error in FollowUser controller: ", error.message);
    if (error.message === "you cannot follow yourself." || error.message === "Already following this user") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Target User Not Found.") {
      return res.status(404).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Server error in followUser controller" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currUserId = req.user.id;
    const targetUserId = req.params.id;

    const result = await userService.unfollowUser(currUserId, targetUserId);
    return res.status(200).json(result);

  } catch (error) {
    console.log("Error in unfollowUser controller: ", error.message);
    if (error.message === "you are not following this user") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Target User Not Found.") {
      return res.status(404).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "server error in unfollowUser controller: " });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.userId);
    // console.log(`Fetched profile for user: ${req.userId}`);
    res.status(200).json(user);

  } catch (error) {
    console.error("Error in getUserProfile controller", error.message);
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { followUser, unfollowUser, getUserProfile };
