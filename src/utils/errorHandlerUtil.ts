import { NextFunction } from "express";
import { AppError, ErrorLayer } from "../errors/AppError";
import logger from "./logger";

export function handleError(
  operation: string,
  method: string,
  error: unknown,
  statusCode: number = 500,
  layer: ErrorLayer,
  className: string,
  options?: {
    publicMessage?: string;
    next?: NextFunction;
  }
): never {
  if (error instanceof Error) {
    //Logging
    logger.error(
      `App Error:\nLayer:${layer}\nClass:${className}\nMethod:${method}\nOriginal error:${error}`
    );

    const newError = new AppError(
      operation,
      method,
      error.message,
      statusCode,
      options?.publicMessage ?? `Error occurred while ${operation}`,
      layer
    );

    if (layer === ErrorLayer.ROUTE && options?.next) {
      options.next(newError);
    } else {
      throw newError;
    }
  }

  throw error;
}
