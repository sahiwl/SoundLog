import mongoose, { Mongoose } from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {},
    releaseDate: {
      type: Number,
      required: true,
    },
    genre: [
      {
        type: String,
      },
    ],
    duration: {
      type: String,
      required: true,
    },
    coverArtURL: {
      type: String,
    },
    avgRating: {
      type: Number,
      // required: true
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;
