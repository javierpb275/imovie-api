import mongoose from "mongoose";
import IMovie from "./movie.interface";
import IUser from "./user.interface";
import IVote from "./vote.interface";

export enum Points {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
}

interface IReview extends mongoose.Document {
  text: string;
  points: Points;
  votes: IVote[];
  movie: IMovie;
  user: IUser;
}

export default IReview;
