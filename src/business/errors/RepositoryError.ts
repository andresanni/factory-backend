export class RepositoryError extends Error{
    constructor(
          public responseMessage: string,
          public statusCode: number = 500,
          public internalDetails: string  
    ){
        super(responseMessage);
        this.name = "RepositoryError";
    }
}