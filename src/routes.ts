import { Router } from "express";

import AuthMiddleware from "./middlewares/auth";

import OrderController from "./controllers/OrderController";
import ProductController from "./controllers/ProductController";
import CustomerController from "./controllers/CustomerController";
import UserController from "./controllers/UserController";

const routes = Router();

routes.post("/ping", (req, res) => {
  return res.status(200).send("pong!");
});

routes.post("/authenticate", AuthMiddleware.generateToken);

routes.use(AuthMiddleware.verifyMiddleware);

routes.post("/order", OrderController.post);
routes.get("/order", OrderController.get);

routes.post("/product", ProductController.post);
routes.get("/product", ProductController.get);

routes.post("/customer", CustomerController.post);
routes.get("/customer", CustomerController.get);

routes.post("/user", UserController.post);
routes.get("/user", UserController.get);

export default routes;
