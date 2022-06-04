import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

export default router;
