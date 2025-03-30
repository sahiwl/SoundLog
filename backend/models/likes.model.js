import mongoose from "mongoose";
//strictly for albums likes only
const likeSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        albumId:{
            type: String,
            required: true
        },
        // itemType: {
        //     type: String,
        //     enum: ["tracks", "albums"],
        //     required: true
        // }, removing this since likes are only for album
        logId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Log",
            default: null
        }
    },
    {timestamps: true}
);

const Likes = mongoose.model("Likes",likeSchema);

export default Likes;