import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
    console.log(err.stack);

    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    res.status(status).json({error: {
        message: message, status:status
    }});
}; 
