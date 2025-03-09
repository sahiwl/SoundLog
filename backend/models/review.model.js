import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to User model
      required: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song", //reference to Song model
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
    dislikes: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
