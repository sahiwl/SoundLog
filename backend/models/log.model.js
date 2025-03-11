import mongoose from "mongoose";
const logSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        songId:{
            type: String,
            required: true
        },
        listenedOn:{
            type: Date,
            default: Date.now
        }
    },
    {timestamps: true}
);
const Log = mongoose.model("Log",logSchema);
export default Log;