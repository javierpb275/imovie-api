import mongoose from "mongoose";
import IMovie from "./movie.interface";
import IUser from "./user.interface";

export enum Points {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

interface IReview extends mongoose.Document {
  text: string;
  points: Points;
  likes: IUser[];
  dislikes: IUser[];
  movie: IMovie;
  user: IUser;
  title: string;
  username: string;
}

export default IReview;
