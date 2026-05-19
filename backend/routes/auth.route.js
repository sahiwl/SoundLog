import express from "express";
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
import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
} from "../validators/auth.schema.js";

const router = express.Router();

const frontendOrigin = () => getFrontendOrigin() || "http://localhost:5173";

router.post("/signup", authRateLimiter, validate(signupSchema), signup);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

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
  (req, res) => {
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
  updateProfile
);

export default router;
