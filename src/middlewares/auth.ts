import { Request, Response, NextFunction } from "express";
import { RequestCustom } from "../interfaces";
import UserController from "../controllers/UserController";
import jwt from "jsonwebtoken";
import auth from "../config/auth";

class AuthMiddleware {
  public async verifyMiddleware(req: RequestCustom, res: Response, next: NextFunction): Promise<Record<string, any> | void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Token not provided!" });
    }

    try {
      const decoded: any = await jwt.verify(authHeader, auth.secret);
      req.userId = decoded.id;

      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token!" });
    }
  }
  public generateToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (req.body.user && req.body.password) {
        const params = {
          user: req.body.user.toString(),
          password: req.body.password.toString(),
        };
        const user = await UserController.getUserInfo(params);
        if (!user[0]) {
          return res.status(401).json({ error: "User or password is invalid!" });
        }
        const { id } = user[0];
        const { secret, ttl } = auth;
        let token;
        if (req.headers) {
          token = jwt.sign({ id }, secret, {
            expiresIn: ttl,
          });
        }
        console.log("Successfully generated token!");
        return res.status(200).json({ auth: true, token: token });
      }
      return res.status(401).json({ error: "User or password is invalid!" });
    } catch (err) {
      console.log("Error to generate token");
      console.log(err);
      return res.status(500).json({ msg: "Error to generate token", err });
    }
  };
}

export default new AuthMiddleware();
