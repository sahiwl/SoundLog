import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
  getMusicPage,
  getAlbumPage,
  getLikesPage, 
  getListenLaterPage, 
  getReviewsPage, 
  getUserReview,
  getUserTrack,
  getUserAlbum,
  getItemPage
} from '../controllers/pagination.controller.js';

const router = express.Router();

//Get pages
router.get('/tracks', getMusicPage);
router.get('/albums', getAlbumPage);
router.get('/likes', getLikesPage);
router.get('/listenlater', getListenLaterPage);
router.get('/review', getReviewsPage);

// User-specific pages for individual items
router.get('/review/:reviewId', protectRoute, getUserReview);
router.get('/track/:itemId', protectRoute, getUserTrack);
router.get('/album/:itemId', protectRoute, getUserAlbum);


export default router; 