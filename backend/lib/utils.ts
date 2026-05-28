import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import { getJwtCookieOptions } from "./authConfig.js";
import type { Response } from "express";

export const generateToken = (userId: string | Types.ObjectId, res: Response) => {
  const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, getJwtCookieOptions());

  return token;
};
