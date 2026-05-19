import express from "express";
import {
  getSmartRecommendations,
  getMoodRecommendations,
  getAIRecommendations,
} from "../controllers/ai.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/recommendations",protectRoute,asyncHandler(getSmartRecommendations));
router.get("/recommendations/mood/:mood",protectRoute,asyncHandler(getMoodRecommendations));
router.get("/ai-recommendations",protectRoute,asyncHandler(getAIRecommendations));

export default router;
