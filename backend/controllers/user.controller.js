import User from "../models/user.model.js";

const followUser = async (req, res) => {
  try {
    const currUserId = req.user.id; //current user id (from auth middleware)
    const targetUserId = req.params.id; //target user id passed as route param

    //this avoids currentuser to follow him/herself
    if (currUserId === targetUserId) {
      return res.status(400).json({ message: "you cannot follow yourself." });
    }

    //if curr user exists in db
    const currUser = await User.findById(currUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
      return res.status(404).json({ message: "Target User Not Found." });
    }

    if (currUser.following.includes(tarUser)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    //add target user to curr user's following array
    currUser.following.push(targetUserId);
    tarUser.following.push(currUserId);

    await currUser.save();
    await tarUser.save();

    console.log(`${currUserId} followed ${targetUserId}`);

    return res.status(200).json({ message: "Successfully followed user." });
  } catch (error) {
    console.log("Error in FollowUser controller: ", error);
    return res
      .status(500)
      .json({ message: "Server error in followUser controller" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currUserId = req.user.id;
    const targetUserId = req.params.id;

    const currUser = await User.findById(currUserId);
    const tarUser = await User.findById(targetUserId);

    if (!tarUser) {
      return res.status(404).json({ message: "Target User Not Found." });
    }

    //check if current user is following the target user
    if (!currUser.following.includes(targetUserId)) {
      return res
        .status(400)
        .json({ message: "you are not following this user" });
    }

    //remove targetUser from curr user's following
    currUser.following = currUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    tarUser.following ==
      tarUser.following.filter((id) => id.toString() !== targetUserId);

    await currUser.save();
    await tarUser.save();

    console.log(`${currUserId} unfollowed ${targetUserId}`);

    return res.status(200).json({ message: "Successfully unfollowed user." });
  } catch (error) {
    console.log("Error in unfollowUser controller: ", error);
    return res
      .status(500)
      .json({ message: "server error in unfollowUser controller: " });
  }
};

const getUserProfile = async (req,res) => {
  try {
      
      // const {userId} = req.params;
      const user = await User.findById(req.userId).select("-password");      
      if(!user){
          return res.status(404).json({message: "User not found"});
      }

      await user.populate("followers","username");
      await user.populate("following","username");
      
      // console.log(`Fetched profile for user: ${req.userId}`);
      res.status(200).json(user);

  } catch (error) {
      console.error("Error in getUserProfile controller", error.message);
      res.status(500).json({message: "Internal Server Error"});
  }
}

export { followUser, unfollowUser, getUserProfile };
