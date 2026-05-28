import mongoose, { Document, Schema, Model } from "mongoose";

// Strictly for albums likes only
export interface ILike extends Document {
    userId: mongoose.Types.ObjectId;
    albumId: string;
    logId?: mongoose.Types.ObjectId | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const likeSchema = new Schema<ILike>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        albumId: {
            type: String,
            required: true
        },
        // itemType: {
        //     type: String,
        //     enum: ["tracks", "albums"],
        //     required: true
        // }, // removing this since likes are only for album
        logId: {
            type: Schema.Types.ObjectId,
            ref: "Log",
            default: null
        }
    },
    { timestamps: true }
);

const Likes: Model<ILike> = mongoose.model<ILike>("Likes", likeSchema);

export default Likes;