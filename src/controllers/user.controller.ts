import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  generateToken,
  comparePassword,
  hashPassword,
} from "../helpers/authentication.helper";
import IUser from "../interfaces/user.interface";
import User from "../models/user.model";
import config from "../config/config";
import { validateObjectProperties } from "../helpers/validation.helper";
import { getMatch, getPaginationOptions } from "../helpers/pagination.helper";
import { IPayload } from "../middlewares/auth.middleware";

let refreshTokens: string[] = [];

class UserController {
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

      const payload = jwt.decode(req.body.token) as IPayload;

      const accessToken: string = generateToken(
        payload.id,
        config.AUTH.ACCESS_TOKEN_SECRET,
        "15m"
      );
      const refreshToken: string = generateToken(
        payload.id,
        config.AUTH.REFRESH_TOKEN_SECRET,
        "20m"
      );
      refreshTokens.push(refreshToken);
      return res.status(200).send({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }

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
      return res.status(400).send({ error: err });
    }
  }

  //SIGN IN
  public async signIn(req: Request, res: Response): Promise<Response> {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ error: "Please, send your email and password" });
    }
    try {
      const foundUser: IUser | null = await User.findOne({
        email: req.body.email,
      });
      if (!foundUser) {
        return res.status(400).send({ error: "Wrong credentials" });
      }
      const isMatch: boolean = await comparePassword(
        req.body.password,
        foundUser.password
      );
      if (!isMatch) {
        return res.status(400).send({ error: "Wrong credentials" });
      }
      const accessToken: string = generateToken(
        foundUser._id.toString(),
        config.AUTH.ACCESS_TOKEN_SECRET,
        "15m"
      );
      const refreshToken: string = generateToken(
        foundUser._id.toString(),
        config.AUTH.REFRESH_TOKEN_SECRET,
        "20m"
      );
      refreshTokens.push(refreshToken);
      return res.status(200).send({
        user: foundUser,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(400).send({ error: "Unable to sign in" });
    }
  }

  //SIGN OUT:
  public async signOut(req: Request, res: Response): Promise<Response> {
    if (!req.body.token) {
      return res.status(400).send({ error: "Please, provide refresh token" });
    }
    if (!refreshTokens.includes(req.body.token)) {
      return res.status(400).send({ error: "Refresh Token Invalid" });
    }
    try {
      refreshTokens = refreshTokens.filter(
        (reToken) => reToken != req.body.token
      );
      return res.status(200).send({ message: "Signed out successfully" });
    } catch (err) {
      return res.status(500).send({ error: "Unable to sign out" });
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
      return res.status(500).send({ error: err });
    }
  }

  //UPDATE PROFILE:
  public async updateProfile(req: Request, res: Response): Promise<Response> {
    const { body, userId } = req;
    const isValid: boolean = validateObjectProperties(body, [
      "username",
      "email",
      "password",
      "avatar",
      "favoriteReviews",
    ]);
    if (!isValid) {
      return res.status(400).send({ error: "Invalid properties!" });
    }
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (body.password) {
        const hash: string = await hashPassword(body.password);
        body.password = hash;
      }
      const updatedUser = await User.findOneAndUpdate({ _id: user._id }, body, {
        new: true,
      });
      return res.status(200).send(updatedUser);
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  }

  //DELETE PROFILE:
  public async deleteProfile(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    if (!req.body.token) {
      return res.status(400).send({ error: "Please, provide refresh token" });
    }
    if (!refreshTokens.includes(req.body.token)) {
      return res.status(400).send({ error: "Refresh Token Invalid" });
    }
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      await user.remove();
      refreshTokens = refreshTokens.filter(
        (reToken) => reToken != req.body.token
      );
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }

  //START FOLLOWING:
  public async startFollowing(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.followeeId) {
        return res.status(400).send({ error: "Please, provide user id!" });
      }
      await User.updateOne(
        { _id: user._id },
        { $push: { followees: body.followeeId } }
      );
      await User.updateOne(
        { _id: body.followeeId },
        { $push: { followers: user._id } }
      );
      return res
        .status(200)
        .send({ message: "Started following user successfully" });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  }

  //STOP FOLLOWING:
  public async stopFollowing(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (!body.followeeId) {
        return res.status(400).send({
          error: "Please, provide user id!",
        });
      }
      await User.updateOne(
        { _id: user._id },
        { $pull: { followees: body.followeeId } }
      );
      await User.updateOne(
        { _id: body.followeeId },
        { $pull: { followers: user._id } }
      );
      return res
        .status(200)
        .send({ message: "Stopped following user successfully" });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  }

  //GET FOLLOWERS
  public async getFollowers(req: Request, res: Response): Promise<Response> {
    const { userId, query } = req;
    const options = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      await user.populate({
        path: "followers",
        match,
        options,
      });
      return res.status(200).send(user.followers);
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }

  //GET FOLLOWEES
  public async getFollowees(req: Request, res: Response): Promise<Response> {
    const { userId, query } = req;
    const options = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      await user.populate({
        path: "followees",
        match,
        options,
      });
      return res.status(200).send(user.followees);
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }

  //GET USER
  public async getUser(req: Request, res: Response): Promise<Response> {
    const { params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: params.id });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }

  //GET USERS
  public async getUsers(req: Request, res: Response): Promise<Response> {
    const { query } = req;
    const { limit, skip, sort } = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const allUsers: IUser[] = await User.find(match)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return res.status(200).send(allUsers);
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }
}

const userController: UserController = new UserController();

export default userController;
