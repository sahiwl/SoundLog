import mongoose from "mongoose";

const Schema = mongoose.Schema;

const listenLaterSchema = new Schema(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        songId: { 
            type: String,
            required: true 
        }, // e.g. '4NHQUGzhtTLFvgF5SZesLK'
        itemType: {
            type: String,
            enum: ["track", "album"], 
            required: true },
            createdAt: { type: Date, 
            default: Date.now 
        },
},{timestamps: true}
);

const ListenLater = mongoose.model("ListenLater", listenLaterSchema);

export default ListenLater
