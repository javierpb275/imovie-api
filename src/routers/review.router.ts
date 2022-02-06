import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import reviewController from "../controllers/review.controller";

const router: Router = Router();

router.get("/", auth, reviewController.getReviews);
router.get("/:id", auth, reviewController.getReview);
router.post("/", auth, reviewController.createReview);
router.patch("/:id", auth, reviewController.updateReview);
router.delete("/:id", auth, reviewController.deleteReview);

export default router;
