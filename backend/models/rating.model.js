import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true, //as we can rate both songs and albums
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to Song model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    itemType: {
      type: String,
      enum: ["tracks", "albums"],
      required: true,
    },
    // logId:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Log",
    //   default: null
    // }
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
