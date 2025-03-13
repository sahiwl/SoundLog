import { addComment, addReview, deleteComment, deleteRating, deleteReview, toggleLike, toggleListened, toggleListenLater, updateOrAddRating, updateReview } from "../controllers/actions.controller.js";

import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/like/:itemType/:itemId", protectRoute, toggleLike)
router.post("/listen/:itemType/:itemId", protectRoute, toggleListened)
router.post("/listenLater/:itemType/:itemId", protectRoute, toggleListenLater)

//rating routes
router.post("/rate/:itemType/:itemId", protectRoute, updateOrAddRating)
router.delete("/rate/:itemType/:itemId", protectRoute, deleteRating)

//review routes
router.post("/review/:itemType/:itemId", protectRoute, addReview)
router.put("/review/:itemType/:itemId", protectRoute, updateReview)
router.delete("/review/:itemType/:itemId", protectRoute, deleteReview)

//comment routes
router.post("/comment", protectRoute, addComment)// Expects reviewId and commentText in body
router.delete("/comment/:commentId", protectRoute, deleteComment)


export default router
