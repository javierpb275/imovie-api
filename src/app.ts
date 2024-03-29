import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import userRouter from "./routers/user.router";
import movieRouter from "./routers/movie.router";
import reviewRouter from "./routers/review.router";
import helloRouter from "./routers/hello.router";

const app: Application = express();

//settings
app.set("port", process.env.PORT || 3001);

//middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

//routes
app.use("/api/hello", helloRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/reviews", reviewRouter);

export default app;
