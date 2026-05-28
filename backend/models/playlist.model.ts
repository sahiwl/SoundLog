import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPlaylist extends Document {
  title: string;
  description?: string;
  albums: string[]; // Spotify album IDs
  createdBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const playlistSchema = new Schema<IPlaylist>(
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
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Playlist: Model<IPlaylist> = mongoose.model<IPlaylist>("Playlist", playlistSchema);

export default Playlist;
