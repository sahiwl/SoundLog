import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        }, 
        fullName: {
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: ""
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
            type: Number,
            ref: "Song",
            default: [],
        }],
    },
    {timestamps: true} //timestamps when account was created
)

const User = mongoose.model("User", userSchema)

export default User