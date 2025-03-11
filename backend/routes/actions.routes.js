import { toggleLike, toggleListened, toggleListenLater, updateOrAddRating } from "../controllers/actions.controller.js";

import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/like/:trackId", protectRoute, toggleLike)
router.post("/listen/:trackId", protectRoute, toggleListened)
router.post("/listenLater/:trackId", protectRoute, toggleListenLater)
router.post("/rate/:trackId", protectRoute, updateOrAddRating)

export default router
