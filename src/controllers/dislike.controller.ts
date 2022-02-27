import { Request, Response } from "express";
import { getMatch, getPaginationOptions } from "../helpers/pagination.helper";
import IDislike from "../interfaces/dislike.interface";
import IReview from "../interfaces/review.interface";
import IUser from "../interfaces/user.interface";
import Dislike from "../models/dislike.model";
import Review from "../models/review.model";
import User from "../models/user.model";

class DislikeController {
  //CREATE DISLIKE
  public async createDislike(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const newDislike: IDislike = new Dislike({ ...body, user: user._id });
      await newDislike.save();
      return res.status(201).send(newDislike);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

    //GET REVIEW DISLIKES
    public async getReviewDislikes(req: Request, res: Response): Promise<Response> {
      const { params, query } = req;
      const options = getPaginationOptions(query);
      const match = getMatch(query);
      try {
        const review: IReview | null = await Review.findOne({
          _id: params.reviewId,
        });
        if (!review) {
          return res.status(404).send({ error: "Review Not Found!" });
        }
        await review.populate({
          path: "dislikes",
          match,
          options,
        });
        return res.status(200).send(review.dislikes);
      } catch (err) {
        return res.status(500).send(err);
      }
    }

  //GET REVIEW DISLIKE
  public async getReviewDislike(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { userId, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const dislike: IDislike | null = await Dislike.findOne({
        user: user._id,
        review: params.reviewId,
      });
      if (!dislike) {
        return res.status(404).send({ error: "Dislike Not Found!" });
      }
      return res.status(200).send({ data: dislike });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }

  //DELETE REVIEW LIKE
  public async deleteReviewDislike(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { userId, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const dislike: IDislike | null = await Dislike.findOne({
        review: params.reviewId,
        user: user._id,
      });
      if (!dislike) {
        return res.status(404).send({ error: "Dislike Not Found!" });
      }
      await dislike.remove();
      return res.status(200).send(dislike);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const dislikeController: DislikeController = new DislikeController();

export default dislikeController;
