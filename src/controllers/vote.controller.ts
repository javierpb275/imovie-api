import { Request, Response } from "express";
import IVote from "../interfaces/vote.interface";
import Vote from "../models/vote.model";
import IUser from "../interfaces/user.interface";
import User from "../models/user.model";
import { getMatch, getPaginationOptions } from "../helpers/pagination.helper";
import { validateObjectProperties } from "../helpers/validation.helper";
import IReview from "../interfaces/review.interface";
import Review from "../models/review.model";

class VoteController {
  //CREATE VOTE
  public async createVote(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const newVote: IVote = new Vote({ ...body, user: user._id });
      await newVote.save();
      return res.status(201).send(newVote);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //GET REVIEW VOTES
  public async getReviewVotes(req: Request, res: Response): Promise<Response> {
    const { params, query } = req;
    try {
      const review: IReview | null = await Review.findOne({
        _id: params.reviewId,
      });
      if (!review) {
        return res.status(404).send({ error: "Review Not Found!" });
      }
      const options = getPaginationOptions(query);
      const match = getMatch(query);
      await review.populate({
        path: "votes",
        select: "like",
        match,
        options,
      });
      return res.status(200).send(review.votes);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  //UPDATE VOTE
  public async updateVote(req: Request, res: Response): Promise<Response> {
    const { userId, body, params } = req;
    const isValid: boolean = validateObjectProperties(body, ["like"]);
    if (!isValid) {
      return res.status(400).send({ error: "Invalid properties!" });
    }
    try {
      const updatedVote: IVote | null = await Vote.findOneAndUpdate(
        { _id: params.id, user: userId },
        body,
        {
          new: true,
        }
      );
      if (!updatedVote) {
        return res.status(404).send({ error: "Vote Not Found!" });
      }
      return res.status(200).send(updatedVote);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //DELETE VOTE
  public async deleteVote(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const vote: IVote | null = await Vote.findOne({
        _id: params.id,
        user: userId,
      });
      if (!vote) {
        return res.status(404).send({ error: "Vote Not Found!" });
      }
      await vote.remove();
      return res.status(200).send(vote);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const voteController: VoteController = new VoteController();

export default voteController;
