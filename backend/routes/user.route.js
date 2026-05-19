import {
  followUser,
  getUserProfile,
  unfollowUser,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";
import { verifyUser } from "../middleware/user.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.put("/follow/:id", protectRoute, asyncHandler(followUser));
router.put("/unfollow/:id", protectRoute, asyncHandler(unfollowUser));
router.get("/:username", verifyUser, asyncHandler(getUserProfile));

export default router;
