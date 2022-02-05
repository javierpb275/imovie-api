import { Router } from "express";
import userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/", userController.signUp);
router.post("/refreshToken", userController.refreshToken);

router.get("/me", auth, userController.getProfile);

export default router;
