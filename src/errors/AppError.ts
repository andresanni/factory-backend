export enum ErrorLayer {
  SERVICE = "service",
  REPOSITORY = "repository",
}

export class AppError extends Error {
  constructor(
    public readonly operation: string, //F.E : "Fetching users" --> External use
    public readonly method: string, //F.E "findAll()" --> Internal use
    public readonly internalMessage: string, //Original error message
    public readonly statusCode: number = 500,
    public readonly publicMessage: string = `Error ocurred while performing ${operation}`, //To include in response
    public readonly layer: ErrorLayer, //"service/"repository defined in concrete classes"
  ) {
    super(internalMessage);
    this.name = this.constructor.name;
  }
}

export class RepositoryLayerError extends AppError {
  constructor(
    operation: string,
    method: string,
    internalMessage: string,
    statusCode: number = 500,
    publicMessage: string = `Error ocurred while performing ${operation}`,
  ) {
    super(
      operation,
      method,
      internalMessage,
      statusCode,
      publicMessage,
      ErrorLayer.REPOSITORY,
    );
  }
}

export class ServiceLayerError extends AppError {
  constructor(
    operation: string,
    method: string,
    internalMessage: string,
    statusCode: number = 500,
    publicMessage: string = `Error ocurred while performing ${operation}`,
  ) {
    super(
      operation,
      method,
      internalMessage,
      statusCode,
      publicMessage,
      ErrorLayer.SERVICE,
    );
  }
}
