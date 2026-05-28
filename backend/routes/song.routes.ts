import express, { Router } from "express";
import { getNewReleasesHandler } from "../controllers/song.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router: Router = express.Router();

router.get("/newreleases", protectRoute, asyncHandler(getNewReleasesHandler));

export default router;
