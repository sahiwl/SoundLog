import type { Document, Types } from "mongoose";

/** Mirrors `models/user.model.js` — move to `user.model.ts` when that file is migrated. */
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  username: string;
  bio: string;
  password?: string;
  profilePic: string;
  googleId?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  favourites: string[];
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    /** Passport session user + JWT `protectRoute` (`req.user`). */
    interface User extends IUser {}

    interface Request {
      /** Set by `verifyUser` middleware (public profile routes). */
      userId?: Types.ObjectId;
      username?: string;
      profilePic?: string;
    }
  }
}

export {};
