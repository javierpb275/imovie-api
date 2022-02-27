import mongoose from "mongoose";
import IReview from "./review.interface";
import IUser from "./user.interface";

interface ILike extends mongoose.Document {
  review: IReview;
  user: IUser;
}

export default ILike;
