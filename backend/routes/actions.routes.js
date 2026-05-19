import {
  addComment, addReview,deleteComment,deleteRating,deleteReview,toggleLike,toggleListened,toggleListenLater,addRating,updateReview,getRating,getReviews,likeReview,getActions,getTrackActions, getTrackRatingsBatch,
} from "../controllers/actions.controller.js";

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  addRatingSchema,
  addReviewSchema,
  updateReviewSchema,
} from "../validators/actions.schema.js";

const router = express.Router();

router.post("/like/:albumId", protectRoute, asyncHandler(toggleLike));
router.post("/listen/:albumId", protectRoute, asyncHandler(toggleListened));
router.post("/listenLater/:albumId", protectRoute, asyncHandler(toggleListenLater));

router.post("/rate/:itemType/:itemId",protectRoute,validate(addRatingSchema),asyncHandler(addRating));
router.get("/rate/:itemType/:itemId",protectRoute,asyncHandler(getRating));
router.delete("/rate/:itemType/:itemId",protectRoute,asyncHandler(deleteRating));

router.post("/review/:albumId",  protectRoute,  validate(addReviewSchema),  asyncHandler(addReview));
router.put("/review/:albumId",  protectRoute,  validate(updateReviewSchema),  asyncHandler(updateReview));
router.delete("/review/:albumId", protectRoute, asyncHandler(deleteReview));
router.get("/review/:albumId", protectRoute, asyncHandler(getReviews));
router.post("/review/like/:reviewId",  protectRoute,  asyncHandler(likeReview));

router.post("/comment", protectRoute, asyncHandler(addComment));
router.delete("/comment/:commentId", protectRoute, asyncHandler(deleteComment));

router.get("/albums/:albumId", protectRoute, asyncHandler(getActions));
router.get("/tracks/ratings", protectRoute, asyncHandler(getTrackRatingsBatch));
router.get("/tracks/:trackId", protectRoute, asyncHandler(getTrackActions));

export default router;
