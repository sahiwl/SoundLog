import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
  getMusicPage,
  getAlbumPage,
  getLikesPage, 
  getListenLaterPage, 
  getReviewsPage, 
  getReviewDetail, 
  getItemDetail,
  getUserReviewDetail,
  getUserTrackDetail,
  getUserAlbumDetail
} from '../controllers/pagination.controller.js';

const router = express.Router();

// Tracks page route
router.get('/tracks', protectRoute, getMusicPage);

// Albums page route
router.get('/albums', protectRoute, getAlbumPage);

// Likes page route
router.get('/likes', protectRoute, getLikesPage);

// Listen Later page route
router.get('/listen-later', protectRoute, getListenLaterPage);

// Reviews page route
router.get('/reviews', protectRoute, getReviewsPage);

// User-specific routes
router.get('/user/review/:reviewId', protectRoute, getUserReviewDetail);
router.get('/user/track/:itemId', protectRoute, getUserTrackDetail);
router.get('/user/album/:itemId', protectRoute, getUserAlbumDetail);

export default router; 