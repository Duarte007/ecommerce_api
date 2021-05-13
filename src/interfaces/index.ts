import { Request, Response } from "express";

export interface RequestCustom extends Request {
  data: any;
  userId: number;
}

export interface ResponseCustom extends Response {
  req: RequestCustom;
}

export interface IPaginate {
  perPage: number;
  currentPage: number;
}

export interface IPagination {
  currentPage: number;
  from: number;
  lastPage?: number;
  perPage: number;
  to: number;
  total?: number;
}

export interface IController {
  get: (req: Request, res: Response) => Promise<Response>;
  post: (req: Request, res: Response) => Promise<Response>;
}
