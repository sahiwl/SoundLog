import mongoose, { Document, Schema, Model } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  albumId: string; // Spotify album ID
  reviewText: string;
  likes?: number;
  likedBy?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    albumId: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
