import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import reviewController from "../controllers/review.controller";

const router: Router = Router();

router.post("/", auth, reviewController.createReview);

export default router;
