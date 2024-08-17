import { Request, Response, NextFunction } from "express";
import { RepositoryError } from "../business/errors/RepositoryError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (error instanceof RepositoryError) {
    console.error(`== Repository error: ${error.internalDetails} ==`);
    res.status(error.statusCode).json({
      error: error.responseMessage,
    });
  }

  console.error(error);
  res.status(500).json({error: "An unexpected error occurred"});
  next();
};
