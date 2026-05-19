import jwt from "jsonwebtoken";
import { getJwtCookieOptions } from "./authConfig.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, getJwtCookieOptions());

  return token;
};

// export const refreshToken = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });
//   res.cookie("jwt", token, {
//     maxAge: 60 * 60 * 1000, // 1 hour
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//     path: '/',
//     domain: 'soundlog-be.onrender.com'
//   });
// };
