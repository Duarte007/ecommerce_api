import express, { Request } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

import routes from "./routes";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json({ limit: "100kb" }));
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(helmet());
    this.express.use(
      rateLimit({
        windowMs: 3 * 60 * 1000, // 3 minutos
        max: 300,
        keyGenerator: function (req: Request) {
          if (req.headers.authorization) {
            return req.headers.authorization;
          } else {
            return req.ip;
          }
        },
      })
    );
  }

  private routes(): void {
    this.express.use(routes);
  }
}

export default new App().express;
