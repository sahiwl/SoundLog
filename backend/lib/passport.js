import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; 

dotenv.config();
const baseURL = process.env.B_PROD_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5001'); 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${baseURL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        

        if (!user && profile.emails && profile.emails.length > 0) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        if (user) {

          if (!user.googleId) {
            user.googleId = profile.id;

            if (!user.profilePic && profile.photos && profile.photos.length > 0) {
              user.profilePic = profile.photos[0].value;
            }
            await user.save();
          }
        } else {

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
            salt
          );
          
          const username = `${profile.displayName.toLowerCase().replace(/[^a-z0-9]/g, "")}${Math.floor(Math.random() * 1000)}`;
          
          user = new User({
            googleId: profile.id,
            username: username,
            email: profile.emails[0].value,
            password: hashedPassword,
            profilePic: profile.photos?.[0]?.value || "",
          });
          
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Google auth error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;