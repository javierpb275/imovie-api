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

voteSchema.methods.toJSON = function () {
  const vote = this;
  const voteObject = vote.toObject();
  delete voteObject.__v;
  return voteObject;
};

const Vote = mongoose.model<IVote>("Vote", voteSchema)

export default Vote;
