import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  searchAlbums,
  searchAll,
  searchArtists,
  searchTracks,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/tracks", protectRoute, asyncHandler(searchTracks));
router.get("/albums", protectRoute, asyncHandler(searchAlbums));
router.get("/artists", protectRoute, asyncHandler(searchArtists));
router.get("/search", protectRoute, asyncHandler(searchAll));

export default router;
