import { Request, Response } from "express";
import { generateToken } from "../helpers/authentication.helper";
import IUser from "../interfaces/user.interface";
import User from "../models/user.model";
import config from "../config/config";

let refreshTokens: string[] = [];

class UserController {
  //SIGN UP:
  public async signUp(req: Request, res: Response): Promise<Response> {
    const newUser: IUser = new User(req.body);
    try {
      const foundUser: IUser | null = await User.findOne({
        email: req.body.email,
      });
      if (foundUser) {
        return res.status(400).send({ error: "Wrong email. Try again" });
      }
      const accessToken: string = generateToken(
        newUser._id.toString(),
        config.AUTH.ACCESS_TOKEN_SECRET,
        "15m"
      );
      const refreshToken: string = generateToken(
        newUser._id.toString(),
        config.AUTH.REFRESH_TOKEN_SECRET,
        "20m"
      );
      refreshTokens.push(refreshToken);
      await newUser.save();
      return res.status(201).send({
        user: newUser,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //REFESH TOKEN
  public async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.token) {
        return res.status(400).send({ error: "Please, provide refresh token" });
      }
      if (!refreshTokens.includes(req.body.token)) {
        return res.status(400).send({ error: "Refresh Token Invalid" });
      }
      refreshTokens = refreshTokens.filter(
        (reToken) => reToken != req.body.token
      );
      const accessToken: string = generateToken(
        req.body.userId,
        config.AUTH.ACCESS_TOKEN_SECRET,
        "15m"
      );
      const refreshToken: string = generateToken(
        req.body.userId,
        config.AUTH.REFRESH_TOKEN_SECRET,
        "20m"
      );
      refreshTokens.push(refreshToken);
      return res.status(200).send({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  //GET PROFILE
  public async getProfile(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const userController: UserController = new UserController();

export default userController;
