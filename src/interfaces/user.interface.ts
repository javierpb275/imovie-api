import mongoose from "mongoose";
import IReview from "./review.interface";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

interface IUser extends mongoose.Document {
  role: Role;
  email: string;
  password: string;
  username: string;
  avatar: string;
  createdReviews: IReview[];
  favoriteReviews: IReview[];
  followers: IUser[];
  followees: IUser[];
}

export default IUser;
