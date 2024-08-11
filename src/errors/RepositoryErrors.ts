export class RepositoryError extends Error{
    constructor(
          public message: string,
          public statusCode: number = 500,
          public internalDetails: string  
    ){
        super(message);
        this.name = "RepositoryError";
    }
}