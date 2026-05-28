import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
    email: string;
    username: string;
    bio?: string;
    password?: string;
    profilePic?: string;
    googleId?: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    favourites: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        bio: {
            type: String,
            default: ""
        },
        password: {
            type: String,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: ""
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        favourites: [{
            type: String // Spotify album IDs — not wired in frontend yet
        }],
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;