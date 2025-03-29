import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  searchAlbums,
  searchAll,
  searchArtists,
  searchTracks,
} from "../controllers/search.controller.js";
import { getAlbumTracksHandler } from "../controllers/song.controller.js";
// import { validateSong } from "../middleware/validateSong.middleware.js";

const router = express.Router();

router.get("/tracks",  protectRoute, searchTracks);
router.get("/albums", protectRoute, searchAlbums);
router.get("/artists", protectRoute, searchArtists);
router.get("/search", protectRoute, searchAll)


export default router
