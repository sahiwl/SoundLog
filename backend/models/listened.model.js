import mongoose from "mongoose";

const listenedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      enum: ["track", "album"],
      required: true,
    },
  },
  { timestamps: true }
);

const Listened = mongoose.model("Listened", listenedSchema);

export default Listened;
