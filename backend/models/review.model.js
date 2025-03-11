import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to User model
      required: true,
    },
    songId: {
      type: String,
      // ref: "Song", //reference to Song model
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    logId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
      default: null
  }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
