import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    getUserReviews,
    getUserAlbums,
    getUserLikes,
    getAlbumPage,
    getTrackPage,
    getNewReleasesPage,
    getArtistPage
} from '../controllers/pagination.controller.js';


const router = express.Router();

//Get pages
router.get('/tracks/:trackId', protectRoute, getTrackPage);
router.get('/albums/:albumId', protectRoute, getAlbumPage);
router.get('/artists/:artistId', protectRoute, getArtistPage);
router.get('/newreleases', protectRoute, getNewReleasesPage);
// router.get('/listenlater', protectRoute, getListenLaterPage);
// router.get('/reviews', protectRoute, getUserReviews);

// User-specific pages for individual items
  router.get('/reviews', protectRoute, getUserReviews);
  router.get('/likes', protectRoute, getUserLikes);
  router.get('/albums', protectRoute, getUserAlbums);
  //getUserListenlater


export default router; 