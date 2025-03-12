import { toggleLike, toggleListened, toggleListenLater, updateOrAddRating } from "../controllers/actions.controller.js";

import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/like/:itemType/:itemId", protectRoute, toggleLike)
router.post("/listen/:itemType/:itemId", protectRoute, toggleListened)
router.post("/listenLater/:itemType/:itemId", protectRoute, toggleListenLater)
router.post("/rate/:itemType/:itemId", protectRoute, updateOrAddRating)


export default router
