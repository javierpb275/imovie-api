import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import dislikeController from "../controllers/dislike.controller";

const router: Router = Router();

router.post("/", auth, dislikeController.createDislike);
router.get("/reviewDislike/:reviewId", auth, dislikeController.getReviewDislike);
router.delete("/reviewDislike/:reviewId", auth, dislikeController.deleteReviewDislike);

export default router;