import { Request, Response } from "express";
import { getMatch, getPaginationOptions } from "../helpers/pagination.helper";
import IMovie from "../interfaces/movie.interface";
import Movie from "../models/movie.model";

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
}

const moviesController: MovieController = new MovieController();

export default moviesController;
