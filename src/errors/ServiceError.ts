import { RepositoryError } from "./RepositoryError";
import StatusCode from "status-code-enum";

export enum ErrorSource {
  Repository = "repository",
  Service = "service",
}

export class ServiceError extends Error {
  constructor(
    public responseMessage: string,
    public statusCode: StatusCode,
    public source: ErrorSource,
    public internalDetails: string,
    public originalError?: Error
  ) {
    super(responseMessage);
    this.name = "ServiceError";
  }

  static fromRepositoryError(err: RepositoryError, criteria?:string): ServiceError {
    const responseMessage = criteria ? `${err.message} , ${criteria}` : err.message;
    return new ServiceError(
      responseMessage,
      err.statusCode,
      ErrorSource.Repository,
      err.internalDetails,
      err
    );
  }

  public toPublicError(): {message: string, statusCode: StatusCode} {
    return{
        message: this.responseMessage,
        statusCode: this.statusCode
    };
  }
}
