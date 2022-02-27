import { Request, Response } from "express";
import ILike from "../interfaces/like.interface";
import IUser from "../interfaces/user.interface";
import Like from "../models/like.model";
import User from "../models/user.model";

class LikeController {
  //CREATE LIKE
  public async createLike(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const newLike: ILike = new Like({ ...body, user: user._id });
      await newLike.save();
      return res.status(201).send(newLike);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //GET REVIEW LIKE
  public async getReviewLike(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const like: ILike | null = await Like.findOne({
        user: user._id,
        review: params.reviewId,
      });
      if (!like) {
        return res.status(404).send({ error: "Like Not Found!" });
      }
      return res.status(200).send({ data: like });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }

  //DELETE REVIEW LIKE
  public async deleteReviewLike(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { userId, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const like: ILike | null = await Like.findOne({
        review: params.reviewId,
        user: user._id,
      });
      if (!like) {
        return res.status(404).send({ error: "Like Not Found!" });
      }
      await like.remove();
      return res.status(200).send(like);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const likeController: LikeController = new LikeController();

export default likeController;
