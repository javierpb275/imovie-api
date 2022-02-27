import mongoose from "mongoose";
import IDislike from "../interfaces/dislike.interface";
import Like from "./like.model";

const dislikeSchema = new mongoose.Schema<IDislike>(
  {
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

dislikeSchema.methods.toJSON = function () {
  const dislike = this;
  const dislikeObject = dislike.toObject();
  delete dislikeObject.__v;
  return dislikeObject;
};

dislikeSchema.pre<IDislike>("save", async function (next) {
  const dislike: IDislike = this;
  await Like.findOneAndDelete({ user: dislike.user, review: dislike.review });
  await Dislike.findOneAndDelete({
    user: dislike.user,
    review: dislike.review,
  });
  next();
});

const Dislike = mongoose.model<IDislike>("Dislike", dislikeSchema);

export default Dislike;
