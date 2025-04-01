import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
// import { refreshToken } from "../lib/utils.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Refresh token if it's close to expiring
    // const now = Math.floor(Date.now() / 1000);
    // const exp = decoded.exp;
    // const timeLeft = exp - now;
    // if (timeLeft < 15 * 60) {
    //   // If less than 15 minutes left
    //   refreshToken(user._id, res);
    // }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
