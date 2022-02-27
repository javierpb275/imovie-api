import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import likeController from "../controllers/like.controller";

const router: Router = Router();

router.post("/", auth, likeController.createLike);
router.get("/reviewLike/:reviewId", auth, likeController.getReviewLike);
router.delete("/reviewLike/:reviewId", auth, likeController.deleteReviewLike);

export default router;
