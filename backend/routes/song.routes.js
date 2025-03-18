import express from "express"
import { getAlbumTracksHandler, getNewReleasesHandler } from "../controllers/song.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.get("/albums/tracks/:itemId", protectRoute, getAlbumTracksHandler)
router.get("/newreleases", protectRoute, getNewReleasesHandler)


export default router
    