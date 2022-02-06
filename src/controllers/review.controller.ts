import { Request, Response } from "express";
import IReview from "../interfaces/review.interface";
import IUser from "../interfaces/user.interface";
import Review from "../models/review.model";
import User from "../models/user.model";

class ReviewController {
  //CREATE REVIEW
  public async createReview(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const newReview: IReview = new Review({ ...body, user: user._id });
      await newReview.save();
      return res.status(201).send(newReview);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

const reviewController: ReviewController = new ReviewController();

export default reviewController;
