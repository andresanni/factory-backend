export enum ErrorLayer {
  SERVICE = "service",
  REPOSITORY = "repository",
  ROUTE = "route",
  CONTROLLER = "controller",
}

export class AppError extends Error {
  constructor(
    public readonly operation: string, //F.E : "Fetching users" --> External use
    public readonly method: string, //F.E "findAll()" --> Internal use
    public readonly internalMessage: string, //Original error message
    public readonly statusCode: number = 500,
    public readonly publicMessage: string = `Error ocurred while performing ${operation}`, //To include in response
    public readonly layer: ErrorLayer //"service/"repository defined in concrete classes"
  ) {
    super(internalMessage);
    this.name = this.constructor.name;
  }
}
