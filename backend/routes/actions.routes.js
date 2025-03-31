import { addComment, addReview, deleteComment, deleteRating, deleteReview, 
         toggleLike, toggleListened, toggleListenLater, addRating, 
         updateReview, getRating, getReviews, likeReview, getActions, getTrackActions } from "../controllers/actions.controller.js";

import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post("/like/:albumId", protectRoute, toggleLike)
router.post("/listen/:albumId", protectRoute, toggleListened)
router.post("/listenLater/:albumId", protectRoute, toggleListenLater)

//rating routes
router.post("/rate/:itemType/:itemId", protectRoute, addRating)
router.get("/rate/:itemType/:itemId", protectRoute, getRating)  // Make sure this route exists
router.delete('/rate/:itemType/:itemId', protectRoute, deleteRating)

//review routes
router.post("/review/:albumId", protectRoute, addReview)
router.put("/review/:albumId", protectRoute, updateReview)
router.delete("/review/:albumId", protectRoute, deleteReview)
router.get("/review/:albumId", protectRoute, getReviews)
router.post("/review/like/:reviewId", protectRoute, likeReview)

//comment routes
router.post("/comment", protectRoute, addComment)// Expects reviewId and commentText in body
router.delete("/comment/:commentId", protectRoute, deleteComment)

router.get("/:albumId", protectRoute, getActions)
router.get("/actions/:trackId", protectRoute, getTrackActions);

export default router
