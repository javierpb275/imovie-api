import { Router } from "express";
import userController from "../controllers/user.controller";

const router: Router = Router();

router.get("/me", userController.getProfile);

export default router;
