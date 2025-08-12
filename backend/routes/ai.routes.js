import express from 'express';
import { getSmartRecommendations, getMoodRecommendations, getAIRecommendations } from '../controllers/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// recommendations based on user's taste
router.get('/recommendations', protectRoute, getSmartRecommendations);

router.get('/recommendations/mood/:mood', protectRoute, getMoodRecommendations);

//recommendations using AI (manual trigger, uses AI quota)
router.get('/ai-recommendations', protectRoute, getAIRecommendations);

export default router;
