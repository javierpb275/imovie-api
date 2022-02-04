import mongoose from "mongoose";
import IReview from "./review.interface";
import IUser from "./user.interface";

interface IVote extends mongoose.Document {
    like: boolean;
    review: IReview;
    user: IUser;
}

export default IVote;
