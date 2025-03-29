import express from "express"
import { getAlbumTracksHandler, getNewReleasesHandler } from "../controllers/song.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';
import { GetSpecificAlbum, GetSpecificTrack } from "../lib/pullSpotifyData.js";

const router = express.Router()

router.get("/albums/tracks/:itemId", protectRoute, getAlbumTracksHandler)
router.get("/newreleases", protectRoute, getNewReleasesHandler)
router.get("/tracks/:trackId", protectRoute, GetSpecificTrack)
router.get("/albums/:albumId", protectRoute, GetSpecificAlbum)


export default router
    