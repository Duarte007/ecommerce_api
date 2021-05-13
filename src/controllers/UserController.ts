import { IUserParams, IUser } from "../interfaces/IUser";
import User from "../models/user";
import { Request, Response } from "express";
import { IController } from "../interfaces";

class UserController implements IController {
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json({});
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error when trying to get user", error: err.message });
    }
  };

  public post = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json({ msg: "User successfully inserted!" });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error when trying to get user", error: err.message });
    }
  };
  public getUserInfo = async (userParams: IUserParams): Promise<IUser[]> => {
    return User.get(userParams);
  };
}

export default new UserController();
