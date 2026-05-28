import jwt from "jsonwebtoken";
import { getJwtCookieOptions } from "./authConfig.js";
import type { Response } from "express";

export const generateToken = (userId: string, res: Response)=> {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, getJwtCookieOptions());

  return token;
};
