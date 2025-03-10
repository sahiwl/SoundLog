import { followUser, getUserProfile, unfollowUser } from "../controllers/user.controller";
import { protectRoute } from "../middleware/auth.middleware";
import { express } from 'express';


const router = express.Router()

router.put("/follow/:id", protectRoute, followUser )
router.put("/unfollow/:id", protectRoute, unfollowUser)
router.get("/:id", protectRoute, getUserProfile)


export default router;