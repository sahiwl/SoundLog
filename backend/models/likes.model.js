import mongoose from "mongoose";
const likeSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        itemId:{
            type: String,
            required: true
        },
        itemType: {
            type: String,
            enum: ["tracks", "albums"],
            required: true
        },
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