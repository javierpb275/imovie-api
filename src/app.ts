import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import userRouter from "./routers/user.router";
import movieRouter from "./routers/movie.router";

const app: Application = express();

//settings
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

//routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);

export default app;
