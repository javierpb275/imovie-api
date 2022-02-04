import mongoose from "mongoose";
import IReview, { Points } from "../interfaces/review.interface";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      enum: Points,
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

export default mongoose.model<IReview>("Review", reviewSchema);
