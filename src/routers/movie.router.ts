import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import movieController from "../controllers/movie.controller";

const router: Router = Router();

router.get("/", auth, movieController.getMovies);
router.get("/:id", auth, movieController.getMovie);
router.post("/", auth, movieController.createMovie);
router.patch("/:id", auth, movieController.updateMovie);
router.delete("/:id", auth, movieController.deleteMovie);

export default router;
