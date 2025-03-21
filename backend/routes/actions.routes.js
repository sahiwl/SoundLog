import { addComment, addReview, deleteComment, deleteRating, deleteReview, toggleLike, toggleListened, toggleListenLater, addRating, updateReview } from "../controllers/actions.controller.js";

import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/like/:albumId", protectRoute, toggleLike)
router.post("/listen/:albumId", protectRoute, toggleListened)
router.post("/listenLater/:albumId", protectRoute, toggleListenLater)

//rating routes
router.post("/rate/:itemType/:itemId", protectRoute, addRating)
router.delete("/rate/albums/:albumId", protectRoute, deleteRating)

//review routes
router.post("/review/:albumId", protectRoute, addReview)
router.put("/review/:albumId", protectRoute, updateReview)
router.delete("/review/:albumId", protectRoute, deleteReview)

//comment routes
router.post("/comment", protectRoute, addComment)// Expects reviewId and commentText in body
router.delete("/comment/:commentId", protectRoute, deleteComment)


export default router
