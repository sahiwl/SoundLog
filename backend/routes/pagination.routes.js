import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    getUserReviews,
    getUserAlbums,
    getUserLikes,
    getAlbumPage,
    getTrackPage,
    getNewReleasesPage
} from '../controllers/pagination.controller.js';


const router = express.Router();

// User-specific pages for individual items
router.get('/tracks/:trackId', protectRoute, getTrackPage);
router.get('/albums/:albumId', protectRoute, getAlbumPage);
router.get('/newreleases', protectRoute, getNewReleasesPage);
// router.get('/listenlater', protectRoute, getListenLaterPage);
// router.get('/reviews', protectRoute, getUserReviews);

//Get pages
  router.get('/reviews', protectRoute, getUserReviews);
  router.get('/likes', protectRoute, getUserLikes);
  router.get('/albums', protectRoute, getUserAlbums);


export default router; 