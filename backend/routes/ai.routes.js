import express from 'express';
import { getSmartRecommendations, getMoodRecommendations, getAIRecommendations } from '../controllers/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// recommendations based on user's taste
router.get('/recommendations', protectRoute, asyncHandler(getSmartRecommendations));

router.get('/recommendations/mood/:mood', protectRoute, asyncHandler(getMoodRecommendations));

//recommendations using AI (manual trigger, uses AI quota)
router.get('/ai-recommendations', protectRoute, asyncHandler(getAIRecommendations));

export default router;
