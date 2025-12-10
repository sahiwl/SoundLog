import { generateToken } from "../lib/utils.js";
import * as authService from "../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const newUser = await authService.signupUser(req.body);

    //generate jwt token here
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
      followers: newUser.followers,
      following: newUser.following
    });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    if (error.message === "User already exists" || error.message === "Password must be at least 6 characters long") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body);

    //generate jwt
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      followers: user.followers,
      following: user.following
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    if (error.message === "Invalid credentials") {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the JWT cookie with the same options used when setting it
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    });
    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Error in updated profile:", error);
    const clientErrors = [
      "Nothing given to update",
      "This username is already taken",
      "An account with this email already exists",
      "Favourites must be an array of up to 4 movies"
    ];
    if (clientErrors.includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
