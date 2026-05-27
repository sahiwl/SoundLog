import mongoose, { Document, Schema, Model } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  commentText: string;
  reviewId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
    // itemType: {
    //   type: String,
    //   enum: ["albums"], // Comments are only for album reviews
    //   default: "albums",
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
