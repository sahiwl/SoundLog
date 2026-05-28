import mongoose, { Document, Schema, Model } from "mongoose";

export interface IListenLater extends Document {
    userId: mongoose.Types.ObjectId;
    albumId: string; // e.g., '4NHQUGzhtTLFvgF5SZesLK'
    createdAt?: Date;
    updatedAt?: Date;
}

const listenLaterSchema = new Schema<IListenLater>(
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
    },
    { timestamps: true }
);

const ListenLater: Model<IListenLater> = mongoose.model<IListenLater>("ListenLater", listenLaterSchema);

export default ListenLater;
