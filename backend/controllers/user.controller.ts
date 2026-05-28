import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../types/authReq.js";
import * as userService from "../services/user.service.js";
import { AppError } from "../lib/AppError.js";
import { requireParam } from "../lib/requestHelpers.js";

export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  const targetUserId = requireParam(req.params.id, "id");
  const result = await userService.followUser(req.user._id, targetUserId);
  res.status(200).json(result);
};

export const unfollowUser = async (req: AuthenticatedRequest, res: Response) => {
  const targetUserId = requireParam(req.params.id, "id");
  const result = await userService.unfollowUser(req.user._id, targetUserId);
  res.status(200).json(result);
};

/** Uses `req.userId` set by `verifyUser` middleware. */
export const getUserProfile = async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new AppError("User not found.", 404);
  }
  const user = await userService.getUserProfile(req.userId);
  res.status(200).json(user);
};
