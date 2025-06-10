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
router.post("/check", checkAuth);


router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.ORIGIN_MAIN}` }),
  (req, res) => { 
    if(!req.user){
      // res.redirect("/"); // or frontend URL
        return res.status(401).json({message: "Google authentication failed"});
    }
     const token = generateToken(req.user._id, res);
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      // return res.redirect(`${process.env.LOCAL}/auth-success?token=${token}`)
      return res.redirect(`${process.env.ORIGIN_MAIN}/auth-success?token=${token}`)
  });

router.patch("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);
export default router;
