export class RepositoryError extends Error {
  public readonly statusCode: number;
  public readonly publicMessage: string;
  public readonly internalMessage: string;

  constructor(
    operation: string,
    internalMessage: string,
    statusCode: number = 500,
    publicMessage?: string
  ) {
    super(publicMessage || `Error occurred while performing ${operation}.`);
    this.statusCode = statusCode;
    this.publicMessage =
      publicMessage || `Error occurred while performing ${operation}.`;
    this.internalMessage = `Operation: ${operation}\nDetails: ${internalMessage}`;
  }
}
