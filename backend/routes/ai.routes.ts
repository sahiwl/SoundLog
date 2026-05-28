import express, { Router } from "express";
import {
  getSmartRecommendations,
  getAIRecommendations,
} from "../controllers/ai.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router: Router = express.Router();

router.get("/recommendations", protectRoute, asyncHandler(getSmartRecommendations));
router.get("/ai-recommendations", protectRoute, asyncHandler(getAIRecommendations));

export default router;
