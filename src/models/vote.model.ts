import mongoose from "mongoose";
import IVote from "../interfaces/vote.interface";

const voteSchema = new mongoose.Schema<IVote>(
  {
    like: {
      type: Boolean,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVote>("Vote", voteSchema);
