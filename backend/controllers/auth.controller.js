import { generateToken } from "../lib/utils.js";
import { getJwtCookieOptions } from "../lib/authConfig.js";
import * as authService from "../services/auth.service.js";

export const signup = async (req, res) => {
  const newUser = await authService.signupUser(req.body);
  generateToken(newUser._id, res);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    profilePic: newUser.profilePic,
    followers: newUser.followers,
    following: newUser.following,
  });
};

export const login = async (req, res) => {
  const user = await authService.loginUser(req.body);
  generateToken(user._id, res);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
    followers: user.followers,
    following: user.following,
  });
};

export const logout = (req, res) => {
  const { maxAge, ...clearOptions } = getJwtCookieOptions();
  res.clearCookie("jwt", clearOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
  res.status(200).json(updatedUser);
};

export const checkAuth = (req, res) => {
  res.status(200).json(req.user);
};
