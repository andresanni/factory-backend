import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = 500;
  let publicMessage = "An unknown error occurred";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    publicMessage = error.publicMessage;
  } else if (error instanceof Error) {
    publicMessage = error.message;
  }

  res.status(statusCode).json({ error: publicMessage });
};
