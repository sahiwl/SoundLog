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
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);


router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.ORIGIN_MAIN}` }),
  // passport.authenticate("google", { failureRedirect: `${process.env.LOCAL}` }),

  (req, res) => { 
    if(!req.user){
      return res.status(401).json({message: "Google authentication failed"});
    }
    const token = generateToken(req.user._id, res);
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      })
      return res.redirect(`${process.env.ORIGIN_MAIN}/auth-success?token=${token}`)
      // return res.redirect(`${process.env.LOCAL}/auth-success?token=${token}`)
  });

router.patch("/update-profile", protectRoute, updateProfile);

export default router;
