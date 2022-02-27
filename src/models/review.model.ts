import mongoose from "mongoose";
import IReview, { Points } from "../interfaces/review.interface";
import User from "./user.model";
import Vote from "./vote.model";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    points: {
      type: Number,
      enum: Points,
      default: 0,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

reviewSchema.virtual("votes", {
  ref: "Vote",
  localField: "_id",
  foreignField: "review",
});

reviewSchema.set("toObject", { virtuals: true });
reviewSchema.set("toJSON", { virtuals: true });

reviewSchema.methods.toJSON = function () {
  const review = this;
  const reviewObject = review.toObject();
  delete reviewObject.__v;
  return reviewObject;
};

reviewSchema.pre<IReview>("remove", async function (next) {
  const review: IReview = this;
  await Vote.deleteMany({ review: review._id });
  await User.updateMany({ $pull: { favoriteReviews: { _id: review._id } } });
  next();
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
