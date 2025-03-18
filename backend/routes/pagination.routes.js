  import express from 'express';
  import { protectRoute } from '../middleware/auth.middleware.js';
  import { 
    getAlbumPage,
    getLikesPage, 
    getListenLaterPage, 
    getUserReview,
    getUserTrack,
    getUserAlbum,
    getReviewsPage,
    getTracksPage,
  } from '../controllers/pagination.controller.js';

  const router = express.Router();

  //Get pages
  router.get('/tracks', protectRoute, getTracksPage);
  router.get('/albums', protectRoute, getAlbumPage);
  router.get('/likes', protectRoute, getLikesPage);
  router.get('/listenlater', protectRoute, getListenLaterPage);
  router.get('/reviews', protectRoute, getReviewsPage);

  // User-specific pages for individual items
  router.get('/reviews/:reviewId', protectRoute, getUserReview);
  router.get('/tracks/:itemId', protectRoute, getUserTrack);
  router.get('/albums/:itemId', protectRoute, getUserAlbum);


  export default router; 