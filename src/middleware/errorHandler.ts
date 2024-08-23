import { Request, Response, NextFunction } from "express";
import { RepositoryError } from "../errors/RepositoryError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (error instanceof RepositoryError) {
    //TODO
  }

  console.error(error);
  res.status(500).json({error: "An unexpected error occurred"});
  next();
};
