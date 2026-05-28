import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";

// Define the JwtPayload type for our JWT structure
interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
      return;
    }

    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ message: "Unauthorized - Invalid Token" });
        return;
      }
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: "Unauthorized - Token Expired" });
        return;
      }
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    // Check payload type for safety
    const userId = typeof decoded === "object" && "userId" in decoded ? decoded.userId : undefined;
    if (!userId || typeof userId !== "string") {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Refresh token if it's close to expiring
    // const now = Math.floor(Date.now() / 1000);
    // const exp = (decoded as JwtPayload).exp;
    // const timeLeft = exp && exp - now;
    // if (timeLeft !== undefined && timeLeft < 15 * 60) {
    //   // If less than 15 minutes left
    //   refreshToken(user._id, res);
    // }

    req.user = user;
    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware: ", error.message);

    //  error guard
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: "Unauthorized - Token Expired" });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
