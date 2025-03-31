import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    getUserReviews,
    getUserAlbums,
    getUserLikes,
    getAlbumPage,
    getTrackPage,
    getNewReleasesPage,
    getArtistPage,
    getUserListenLater
} from '../controllers/pagination.controller.js';


const router = express.Router();

//Get pages
router.get('/tracks/:trackId', protectRoute, getTrackPage);
router.get('/albums/:albumId', protectRoute, getAlbumPage);
router.get('/artists/:artistId', protectRoute, getArtistPage);
router.get('/newreleases', protectRoute, getNewReleasesPage);


// User-specific pages for individual items
router.get('/:username/reviews', protectRoute, getUserReviews);
router.get('/:username/likes', protectRoute, getUserLikes);
router.get('/:username/albums', protectRoute, getUserAlbums);
router.get('/:username/listenlater', protectRoute, getUserListenLater);

export default router;