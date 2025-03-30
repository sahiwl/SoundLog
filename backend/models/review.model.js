import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to User model
      required: true,
    },
    albumId: {
      type: String,
      // ref: "Song", //reference to Song model
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0, // Default like count is 0
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
