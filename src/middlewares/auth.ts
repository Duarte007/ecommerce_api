import { Request, Response, NextFunction } from "express";
import { RequestCustom } from "../interfaces";
import UserController from "../controllers/UserController";
import jwt from "jsonwebtoken";
import auth from "../config/auth";

class AuthMiddleware {
  public async verifyMiddleware(
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<Record<string, any> | void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Token não fornecido!" });
    }

    try {
      const decoded: any = await jwt.verify(authHeader, auth.secret);
      req.userId = decoded.id;

      return next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido!" });
    }
  }
  public generateToken = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (req.body.user && req.body.password) {
      const params = {
        user: req.body.user.toString(),
        password: req.body.password.toString(),
      };
      const user = await UserController.getUserInfo(params);
      if (!user[0]) {
        return res.status(401).json({ error: "Usuário ou senha inválidos!" });
      }
      const { id } = user[0];
      const { secret, ttl } = auth;
      let token;
      if (req.headers) {
        token = jwt.sign({ id }, secret, {
          expiresIn: ttl,
        });
      }
      return res.status(200).json({ auth: true, token: token });
    }
    return res.status(401).json({ error: "Usuário ou senha inválidos!" });
  };
}

export default new AuthMiddleware();
