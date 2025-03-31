import { followUser, getUserProfile, unfollowUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import  express  from 'express';
import { verifyUser } from "../middleware/user.middleware.js";


const router = express.Router()

router.put("/follow/:id", protectRoute, followUser )
router.put("/unfollow/:id", protectRoute, unfollowUser)
router.get("/:username", verifyUser, getUserProfile)


export default router;