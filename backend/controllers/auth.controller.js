import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedpass,
    });

    if (newUser) {
      //generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
        followers: newUser.followers,
        following: newUser.following
      });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //compare password provided by user with hashed password in db
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out sucessfully" });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    //profile pic, favorites will be added later
    const { username, email, bio} = req.body;
    const userId = req.user._id;

    if (!username || !email || !bio ) {
      res.status(400).json({ message: "Fields are missing" });
    }

    let updateData = {}

    // const uploadRes = await cloudinary.uploader.upload(profilePic);
    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   { profilePic: uploadRes.secure_url },
    //   { new: true }
    // );
    if(username){
      const existingUser = await User.findOne({username});
      if(existingUser && existingUser._id.toString() !== userId.toString()){
          return res.status(400).json({message: "This username is already taken"});
      }
      updateData.username = username;
  }

  if(email){
      const existingUser = await User.findOne({email});
      if(existingUser && existingUser._id.toString() !== userId.toString()){
          return res.status(400).json({message: "An account with this email already exists"});
      }
      updateData.email = email;
  }

  if(bio !== undefined){
      updateData.bio = bio;
  }

  const updatedUser = await User.findByIdAndUpdate(userId,updateData,{new:true});

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile: ", error);
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
