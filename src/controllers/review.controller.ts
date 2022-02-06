import { Request, Response } from "express";
import { getMatch, getPaginationOptions } from "../helpers/pagination.helper";
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

  //GET REVIEWS
  public async getReviews(req: Request, res: Response): Promise<Response> {
    const { query } = req;
    const { limit, skip, sort } = getPaginationOptions(query);
    const options = { limit, skip, sort };
    const match = getMatch(query);
    try {
      const allReviews: IReview[] = await Review.find(match)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: "user", select: "_id username email", match, options },
          { path: "movie", select: "_id title", match, options },
        ]);
      return res.status(200).send(allReviews);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  //GET REVIEW
  public async getReview(req: Request, res: Response): Promise<Response> {
    const { params } = req;
    try {
      const review: IReview | null = await Review.findOne({ _id: params.id });
      if (!review) {
        return res.status(404).send({ error: "Review Not Found!" });
      }
      await review.populate([
        { path: "user", select: "_id username email" },
        { path: "movie", select: "_id title" },
      ]);
      return res.status(200).send(review);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const reviewController: ReviewController = new ReviewController();

export default reviewController;
