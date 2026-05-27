import type { Types } from "mongoose";
import type { IUser } from "../models/user.model.js";

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
