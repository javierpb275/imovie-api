import mongoose from "mongoose";
import ILike from "../interfaces/like.interface";
import Dislike from "./dislike.model";

const likeSchema = new mongoose.Schema<ILike>(
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

likeSchema.methods.toJSON = function () {
  const like = this;
  const likeObject = like.toObject();
  delete likeObject.__v;
  return likeObject;
};

likeSchema.pre<ILike>("save", async function (next) {
  const like: ILike = this;
  await Dislike.findOneAndDelete({ user: like.user, review: like.review });
  await Like.findOneAndDelete({ user: like.user, review: like.review });
  next();
});

const Like = mongoose.model<ILike>("Like", likeSchema);

export default Like;
