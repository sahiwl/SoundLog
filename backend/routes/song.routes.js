import express from "express";
import {
  getAlbumTracksHandler,
  getNewReleasesHandler,
} from "../controllers/song.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/albums/tracks/:itemId",protectRoute,asyncHandler(getAlbumTracksHandler));
router.get("/newreleases",protectRoute,asyncHandler(getNewReleasesHandler));

export default router;
