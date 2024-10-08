import { ErrorLayer } from "../errors/AppError";
import { RepositoryLayerError, ServiceLayerError } from "../errors/AppError";

export function handleError(
  operation: string,
  method: string,
  error: unknown,
  statusCode: number = 500,  
  layer: ErrorLayer,
  className: string
): never {
  if (error instanceof Error) {
    //Logging
    console.error(
      `App Error:\nLayer:${layer}\nClass:${className}\nMethod:${method}\nOriginal error:${error}`
    );
    //Creating public message
    const publicMessage = `Error occurred while ${operation}`;
    //Create and throw specific error
    if (layer === ErrorLayer.REPOSITORY) {
      throw new RepositoryLayerError(
        operation,
        method,
        error.message,
        statusCode,
        publicMessage
      );
    }

    if (layer === ErrorLayer.SERVICE) {
      throw new ServiceLayerError(
        operation,
        method,
        error.message,
        statusCode,
        publicMessage
      );
    }
  }

  throw error;
}
