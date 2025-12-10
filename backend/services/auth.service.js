import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signupUser = async ({ username, email, password }) => {
    if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }
    const user = await User.findOne({ email });
    if (user) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newUser = new User({
        username: username,
        email: email,
        password: hashedpass,
    });

    await newUser.save();
    return newUser;
};

export const loginUser = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid credentials");
    }
    return user;
};

export const updateUserProfile = async (userId, { profilePic, username, email, bio, favourites }) => {
    if (!profilePic && !username && !email && !bio && !favourites) {
        throw new Error("Nothing given to update");
    }

    let updateData = {};

    if (profilePic) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        updateData.profilePic = uploadResponse.secure_url;
    }

    if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new Error("This username is already taken");
        }
        updateData.username = username;
    }

    if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new Error("An account with this email already exists");
        }
        updateData.email = email;
    }

    if (bio !== undefined) {
        updateData.bio = bio;
    }

    if (favourites) {
        if (!Array.isArray(favourites) || favourites.length > 4) {
            throw new Error("Favourites must be an array of up to 4 movies");
        }
        updateData.favourites = favourites;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return updatedUser;
};
