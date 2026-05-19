import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    albums: [
      {
        type: String, // Spotify album IDs
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
