import { Router } from "express";
import userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/refreshToken", userController.refreshToken);
router.post("/", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/signout", auth, userController.signOut);
router.get("/me", auth, userController.getProfile);
router.patch("/me", auth, userController.updateProfile);
router.delete("/me", auth, userController.deleteProfile);

export default router;
