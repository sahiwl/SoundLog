import mongoose, { Document, Schema, Model } from "mongoose";

export interface IRating extends Document {
  itemId: string;
  userId: mongoose.Types.ObjectId;
  rating: number;
  itemType: "tracks" | "albums";
  // logId?: mongoose.Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    itemId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

const Rating: Model<IRating> = mongoose.model<IRating>("Rating", ratingSchema);

export default Rating;
