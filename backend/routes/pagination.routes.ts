import express, { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {getUserReviews,getUserAlbums,getUserLikes,getAlbumPage,getTrackPage,getArtistPage,getUserListenLater,
} from "../controllers/pagination.controller.js";

const router: Router = express.Router();

router.get("/tracks/:trackId", protectRoute, asyncHandler(getTrackPage));
router.get("/albums/:albumId", protectRoute, asyncHandler(getAlbumPage));
router.get("/artists/:artistId", protectRoute, asyncHandler(getArtistPage));
router.get("/:username/reviews", protectRoute, asyncHandler(getUserReviews));
router.get("/:username/likes", protectRoute, asyncHandler(getUserLikes));
router.get("/:username/albums", protectRoute, asyncHandler(getUserAlbums));
router.get("/:username/listenlater", protectRoute, asyncHandler(getUserListenLater));

export default router;
