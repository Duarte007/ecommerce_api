import { IUserParams, IUser } from "../interfaces/IUser";
import User from "../models/user";
import { Request, Response } from "express";
import { IController } from "../interfaces";
import UserTransformation from "../transformation/UserTransformation";

class UserController implements IController {
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json({});
    } catch (err) {
      return res.status(500).json({ msg: "Error when trying to get user", error: err.message });
    }
  };

  public post = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = req.body;
      if (typeof data !== "object") return res.status(400).json({ msg: "Invalid body. We expect a object." });
      if (data.hasOwnProperty && !data.hasOwnProperty("login"))
        return res.status(400).json({ msg: "Invalid body. 'login' required." });
      if (data.hasOwnProperty && !data.hasOwnProperty("password"))
        return res.status(400).json({ msg: "Invalid body. 'password' required." });

      const formattedUser = UserTransformation.getUserObject(data);
      const result = await User.post(formattedUser);
      if (result) {
        console.log("User(s) successfully registered!");
        return res.status(200).json({ msg: "User successfully inserted!" });
      }
      return res.status(500).json({ msg: "Error when trying to insert user", data: formattedUser });
    } catch (err) {
      return res.status(500).json({ msg: "Error when trying to insert user", error: err.message });
    }
  };

  public getUserInfo = async (userParams: IUserParams): Promise<IUser[]> => {
    try {
      return User.get(userParams);
    } catch (err) {
      console.log("Error to get user info");
      return Promise.reject(err);
    }
  };
}

export default new UserController();
