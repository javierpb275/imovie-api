import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import voteController from "../controllers/vote.controller";

const router: Router = Router();

router.post("/", auth, voteController.createVote);
router.get("/reviewVotes/:reviewId", auth, voteController.getReviewVotes);
router.patch("/:id", auth, voteController.updateVote);
router.delete("/:id", auth, voteController.deleteVote);

export default router;
