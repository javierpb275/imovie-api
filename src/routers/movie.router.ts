import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import movieController from "../controllers/movie.controller";

const router: Router = Router();

router.get("/", auth, movieController.getMovies);

export default router;
