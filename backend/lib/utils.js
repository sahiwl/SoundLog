import jwt from "jsonwebtoken";
import { getJwtCookieOptions } from "./authConfig.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, getJwtCookieOptions());

  return token;
};
