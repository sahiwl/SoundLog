import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from "passport-google-oauth20";
import dotenv from "dotenv";
import User, { IUser } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { getGoogleCallbackUrl } from "./authConfig.js";
import { Request } from "express";

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    "Google OAuth: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — /auth/google will fail."
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: getGoogleCallbackUrl(),
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback
    ) => {
      try {
        // @ts-ignore
        let user: IUser | null = await User.findOne({ googleId: profile.id });

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
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google account has no email — cannot sign up."), null);
          }

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
            salt
          );

          const baseName = (profile.displayName || "user")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "user";
          const username = `${baseName}${Math.floor(Math.random() * 10000)}`;

          user = new User({
            googleId: profile.id,
            username,
            email,
            password: hashedPassword,
            profilePic: profile.photos?.[0]?.value || "",
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Google auth error:", err);
        return done(err as Error, null);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done: (err: any, id?: any) => void) => {
  // @ts-ignore
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | null) => void) => {
  try {
    // @ts-ignore
    const user: IUser | null = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;