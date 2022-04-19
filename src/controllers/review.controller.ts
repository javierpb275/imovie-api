import { Request, Response } from "express";
import { getMatch, getPaginationOptions } from "../helpers/pagination.helper";
import { validateObjectProperties } from "../helpers/validation.helper";
import IMovie from "../interfaces/movie.interface";
import IReview from "../interfaces/review.interface";
import IUser from "../interfaces/user.interface";
import Movie from "../models/movie.model";
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
      return res.status(400).send({error: err});
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
          { path: "user", select: "_id username email avatar", match, options },
          { path: "movie", select: "_id title", match, options },
        ]);
      return res.status(200).send(allReviews);
    } catch (err) {
      return res.status(500).send({error: err});
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
        { path: "user", select: "_id username email avatar" },
        { path: "movie", select: "_id title" },
      ]);
      return res.status(200).send(review);
    } catch (err) {
      return res.status(500).send({error: err});
    }
  }

  //UPDATE REVIEW
  public async updateReview(req: Request, res: Response): Promise<Response> {
    const { userId, body, params } = req;
    const isValid: boolean = validateObjectProperties(body, ["text", "points"]);
    if (!isValid) {
      return res.status(400).send({ error: "Invalid properties!" });
    }
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const updatedReview: IReview | null = await Review.findOneAndUpdate(
        { _id: params.id, user: user._id },
        body,
        {
          new: true,
        }
      );
      if (!updatedReview) {
        return res.status(404).send({ error: "Review Not Found!" });
      }
      return res.status(200).send(updatedReview);
    } catch (err) {
      return res.status(400).send({error: err});
    }
  }

  //DELETE REVIEW
  public async deleteReview(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const review: IReview | null = await Review.findOne({
        _id: params.id,
        user: user._id,
      });
      if (!review) {
        return res.status(404).send({ error: "Review Not Found!" });
      }
      await review.remove();
      return res.status(200).send(review);
    } catch (err) {
      return res.status(500).send({error: err});
    }
  }

  //GET MOVIE REVIEWS
  public async getMovieReviews(req: Request, res: Response): Promise<Response> {
    const { params, query } = req;
    const options = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const movie: IMovie | null = await Movie.findOne({ _id: params.movieId });
      if (!movie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      await movie.populate({
        path: "reviews",
        match,
        options,
        populate: [
          { path: "user", select: "_id username email avatar", match, options },
          { path: "movie", select: "_id title", match, options },
        ]
      });
      return res.status(200).send(movie.reviews);
    } catch (err) {
      return res.status(500).send({error: err});
    }
  }

  //GET PROFILE REVIEWS
  public async getProfileReviews(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { userId, query } = req;
    const options = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      await user.populate({
        path: "createdReviews",
        match,
        options,
        populate: [
          { path: "user", select: "_id username email avatar", match, options },
          { path: "movie", select: "_id title", match, options },
        ]
      });
      return res.status(200).send(user.createdReviews);
    } catch (err) {
      return res.status(500).send({error: err});
    }
  }

  //GET USER REVIEWS
  public async getUserReviews(req: Request, res: Response): Promise<Response> {
    const { params, query } = req;
    const options = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const user: IUser | null = await User.findOne({ _id: params.userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      await user.populate({
        path: "createdReviews",
        match,
        options,
        populate: [
          { path: "user", select: "_id username email avatar", match, options },
          { path: "movie", select: "_id title", match, options },
        ]
      });
      return res.status(200).send(user.createdReviews);
    } catch (err) {
      return res.status(500).send({error: err});
    }
  }

  //ADD LIKE:
  public async addLike(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.reviewId) {
        return res.status(400).send({ error: "Please, provide review id!" });
      }
      await Review.updateOne(
        { _id: body.reviewId },
        { $pull: { likes: user._id, dislikes: user._id } }
      );
      await Review.updateOne(
        { _id: body.reviewId },
        { $push: { likes: user._id } }
      );
      return res.status(200).send({ message: "Added like successfully" });
    } catch (err) {
      return res.status(400).send({error: err});
    }
  }

  //REMOVE LIKE:
  public async removeLike(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.reviewId) {
        return res.status(400).send({ error: "Please, provide review id!" });
      }
      await Review.updateOne(
        { _id: body.reviewId },
        { $pull: { likes: user._id } }
      );
      return res.status(200).send({ message: "Removed like successfully" });
    } catch (err) {
      return res.status(400).send({error: err});
    }
  }

  //ADD DISLIKE:
  public async addDislike(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.reviewId) {
        return res.status(400).send({ error: "Please, provide review id!" });
      }
      await Review.updateOne(
        { _id: body.reviewId },
        { $pull: { likes: user._id, dislikes: user._id } }
      );
      await Review.updateOne(
        { _id: body.reviewId },
        { $push: { dislikes: user._id } }
      );
      return res.status(200).send({ message: "Added dislike successfully" });
    } catch (err) {
      return res.status(400).send({error: err});
    }
  }

  //REMOVE DISLIKE:
  public async removeDislike(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.reviewId) {
        return res.status(400).send({ error: "Please, provide review id!" });
      }
      await Review.updateOne(
        { _id: body.reviewId },
        { $pull: { dislikes: user._id } }
      );
      return res.status(200).send({ message: "Removed dislike successfully" });
    } catch (err) {
      return res.status(400).send({error: err});
    }
  }

  //ADD FAVORITES:
  public async addFavorites(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.reviewId) {
        return res.status(400).send({ error: "Please, provide review id!" });
      }
      await User.updateOne(
        { _id: user._id },
        { $push: { favoriteReviews: body.reviewId } }
      );
      return res.status(200).send({ message: "Added review successfully" });
    } catch (err) {
      return res.status(400).send({error: err});
    }
  }

  //REMOVE FAVORITES:
  public async removeFavorites(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.reviewId) {
        return res.status(400).send({ error: "Please, provide review id!" });
      }
      await User.updateOne(
        { _id: user._id },
        { $pull: { favoriteReviews: body.reviewId } }
      );
      return res.status(200).send({ message: "Removed review successfully" });
    } catch (err) {
      return res.status(400).send({error: err});
    }
  }

  //GET FAVORITE REVIEWS
  public async getFavoriteReviews(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { userId, query } = req;
    const options = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      await user.populate({
        path: "favoriteReviews",
        match,
        options,
        populate: [
          { path: "user", select: "_id username email avatar", match, options },
          { path: "movie", select: "_id title", match, options },
        ]
      });
      return res.status(200).send(user.favoriteReviews);
    } catch (err) {
      return res.status(500).send({error: err});
    }
  }
}

const reviewController: ReviewController = new ReviewController();

export default reviewController;
