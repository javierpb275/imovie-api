import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import reviewController from "../controllers/review.controller";

const router: Router = Router();

router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReview);
router.post("/", auth, reviewController.createReview);

export default router;
