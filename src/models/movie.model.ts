import mongoose from "mongoose";
import IMovie, { Genre } from "../interfaces/movie.interface";
import Review from "./review.model";

const movieSchema = new mongoose.Schema<IMovie>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    year: {
      type: String,
      trim: true,
    },
    runtime: {
      type: String,
      trim: true,
    },
    genres: [
      {
        type: String,
        enum: Genre,
      },
    ],
    director: {
      type: String,
      trim: true,
    },
    actors: {
      type: String,
      trim: true,
    },
    plot: {
      type: String,
      trim: true,
    },
    posterUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "movie",
});

movieSchema.set("toObject", { virtuals: true });
movieSchema.set("toJSON", { virtuals: true });

movieSchema.pre<IMovie>("remove", async function (next) {
  const movie: IMovie = this;
  await Review.deleteMany({ movie: movie._id });
  next();
});

export default mongoose.model<IMovie>("Movie", movieSchema);
