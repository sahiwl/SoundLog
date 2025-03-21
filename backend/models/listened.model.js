import mongoose from "mongoose";

const listenedSchema = new mongoose.Schema(
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
    // itemType: {
    //   type: String,
    //   enum: ["tracks", "albums"],
    //   required: true,
    // },removing this since likes are only for album
  },
  { timestamps: true }
);

const Listened = mongoose.model("Listened", listenedSchema);

export default Listened;
