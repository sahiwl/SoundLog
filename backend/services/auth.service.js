import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { AppError } from "../lib/AppError.js";
import { getAlbumDetails } from "./song.service.js";

export const signupUser = async ({ username, email, password }) => {
    if (!password || password.length < 6) {
        throw new AppError("Password must be at least 6 characters long", 400);
    }
    const user = await User.findOne({ email });
    if (user) {
        throw new AppError("User already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashedpass,
    });

    await newUser.save();
    return newUser;
};

export const loginUser = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new AppError("Invalid credentials", 400);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError("Invalid credentials", 400);
    }
    return user;
};

export const updateUserProfile = async (userId, { profilePic, username, email, bio, favourites }) => {
    if (!profilePic && !username && !email && bio === undefined && !favourites) {
        throw new AppError("Nothing given to update", 400);
    }

    const updateData = {};

    if (profilePic) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        updateData.profilePic = uploadResponse.secure_url;
    }

    if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new AppError("This username is already taken", 409);
        }
        updateData.username = username;
    }

    if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new AppError("An account with this email already exists", 409);
        }
        updateData.email = email;
    }

    if (bio !== undefined) {
        updateData.bio = bio;
    }

    if (favourites) {
        if (!Array.isArray(favourites) || favourites.length > 4) {
            throw new AppError("Favourites must be an array of up to 4 albums", 400);
        }
        // each favourite album is cached locally so the profile renders fast
        await Promise.all(
            favourites.map((albumId) =>
                getAlbumDetails(albumId).catch(() => {
                    throw new AppError(`Album ${albumId} not found on Spotify.`, 404);
                })
            )
        );
        updateData.favourites = favourites;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return updatedUser;
};
