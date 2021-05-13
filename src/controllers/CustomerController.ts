import { Request, Response } from "express";
import { IController } from "../interfaces";

class CustomerController implements IController {
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json({});
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error when trying to get customer", error: err.message });
    }
  };

  public post = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json({ msg: "Customer successfully inserted!" });
    } catch (err) {
      return res
        .status(500)
        .json({
          msg: "Error when trying to insert customer",
          error: err.message,
        });
    }
  };
}

export default new CustomerController();
