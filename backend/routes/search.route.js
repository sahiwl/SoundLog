import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { searchAll } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/search", protectRoute, asyncHandler(searchAll));

export default router;
