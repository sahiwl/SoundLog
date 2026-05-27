import mongoose, { Document, Schema, Model } from "mongoose";

export interface IListened extends Document {
  userId: mongoose.Types.ObjectId;
  albumId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const listenedSchema = new Schema<IListened>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    albumId: {
      type: String,
      required: true,
    },
    // itemType: {
    //   type: String,
    //   enum: ["tracks", "albums"],
    //   required: true,
    // }, // removing this since likes are only for album
  },
  { timestamps: true }
);

const Listened: Model<IListened> = mongoose.model<IListened>("Listened", listenedSchema);

export default Listened;
