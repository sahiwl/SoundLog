import express, { Request, Response } from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import passport from "passport";
import { generateToken } from "../lib/utils.js";
import { getFrontendOrigin } from "../lib/authConfig.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
} from "../validators/auth.schema.js";

const router = express.Router();

const frontendOrigin = (): string =>
  getFrontendOrigin() || "http://localhost:5173";

router.post("/signup", authRateLimiter, validate(signupSchema), asyncHandler(signup));
router.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(login));
router.post("/logout", logout);
router.get("/check", protectRoute, asyncHandler(checkAuth));

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${frontendOrigin()}/signin?error=google_auth_failed`,
    session: true,
  }),
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(`${frontendOrigin()}/signin?error=google_auth_failed`);
    }

    generateToken(req.user._id, res);
    return res.redirect(`${frontendOrigin()}/auth-success`);
  }
);

router.patch(
  "/update-profile",
  protectRoute,
  validate(updateProfileSchema),
  asyncHandler(updateProfile)
);

export default router;
