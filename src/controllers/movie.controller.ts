import { Request, Response } from "express";
import { getMatch, getPaginationOptions } from "../helpers/pagination.helper";
import IMovie from "../interfaces/movie.interface";
import IUser from "../interfaces/user.interface";
import Movie from "../models/movie.model";
import User from "../models/user.model";

class MovieController {
  //GET MOVIES
  public async getMovies(req: Request, res: Response): Promise<Response> {
    const { query } = req;
    const { limit, skip, sort } = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const allMovies: IMovie[] = await Movie.find(match)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return res.status(200).send(allMovies);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  //GET MOVIE
  public async getMovie(req: Request, res: Response): Promise<Response> {
    const { params } = req;
    try {
      const movie: IMovie | null = await Movie.findOne({ _id: params.id });
      if (!movie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      return res.status(200).send(movie);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  //CREATE MOVIE
  public async createMovie(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (user.role !== "ADMIN") {
        return res.status(401).send({ error: "You are not authorized!" });
      }
      const newMovie: IMovie = new Movie(body);
      await newMovie.save();
      return res.status(201).send(newMovie);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //UPDATE MOVIE
  public async updateMovie(req: Request, res: Response): Promise<Response> {
    const { userId, body, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (user.role !== "ADMIN") {
        return res.status(401).send({ error: "You are not authorized!" });
      }
      const updatedMovie: IMovie | null = await Movie.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
        }
      );
      if (!updatedMovie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      return res.status(200).send(updatedMovie);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //DELETE MOVIE
  public async deleteMovie(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (user.role !== "ADMIN") {
        return res.status(401).send({ error: "You are not authorized!" });
      }
      const movie: IMovie | null = await Movie.findOne({
        _id: params.id,
      });
      if (!movie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      await movie.remove();
      return res.status(200).send(movie);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const moviesController: MovieController = new MovieController();

export default moviesController;
