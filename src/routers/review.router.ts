import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import reviewController from "../controllers/review.controller";

const router: Router = Router();

router.get("/", auth, reviewController.getReviews);
router.get("/:id", auth, reviewController.getReview);
router.post("/", auth, reviewController.createReview);
router.patch("/:id", auth, reviewController.updateReview);
router.delete("/:id", auth, reviewController.deleteReview);
router.post("/addLike", auth, reviewController.addLike);
router.post("/removeLike", auth, reviewController.removeLike);
router.post("/addDislike", auth, reviewController.addDislike);
router.post("/removeDislike", auth, reviewController.removeDislike);
router.post("/addFavorites", auth, reviewController.addFavorites);
router.post("/removeFavorites", auth, reviewController.removeFavorites);
router.get("/me/favoriteReviews", auth, reviewController.getFavoriteReviews);
router.get("/me/createdReviews", auth, reviewController.getProfileReviews);
router.get("/userReviews/:username", auth, reviewController.getUserReviews);
router.get("/movieReviews/:movieTitle", auth, reviewController.getMovieReviews);

export default router;
