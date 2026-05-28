import type { Request, Response } from "express";
import { generateToken } from "../lib/utils.js";
import { getJwtCookieOptions } from "../lib/authConfig.js";
import * as authService from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../types/authReq.js";
import type { LoginInput, SignupInput, UpdateProfileInput } from "../validators/auth.schema.js";

export const signup = async (req: Request, res: Response) => {
  const newUser = await authService.signupUser(req.body as SignupInput["body"]);
  generateToken(newUser._id.toString(), res);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    profilePic: newUser.profilePic,
    followers: newUser.followers,
    following: newUser.following,
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body as LoginInput["body"]);
  generateToken(user._id.toString(), res);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
    followers: user.followers,
    following: user.following,
  });
};

export const logout = (_req: Request, res: Response) => {
  const { maxAge: _maxAge, ...clearOptions } = getJwtCookieOptions();
  res.clearCookie("jwt", clearOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const updatedUser = await authService.updateUserProfile(
    req.user._id,
    req.body as UpdateProfileInput["body"]
  );
  res.status(200).json(updatedUser);
};

export const checkAuth = (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json(req.user);
};
