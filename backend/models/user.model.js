import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        }, 
        username: {
            type: String,
            required: true,
            unique: true,  // Add this
            trim: true
        },
        bio:{
            type: String,
            default:""
        },
        password:{
            type: String,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: ""
        },
        googleId:{
            type: String,
            unique: true
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