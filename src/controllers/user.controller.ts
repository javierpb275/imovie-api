import { Request, Response } from "express";

class UserController {
  public async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getProfile");
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const userController: UserController = new UserController();

export default userController;
