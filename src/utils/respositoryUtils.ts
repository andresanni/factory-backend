import { RepositoryError } from "../errors/RepositoryError";

export function handleError(
  operation: string,
  error: unknown,
  repositoryName: string
): never {
  if (error instanceof Error) {
    console.error(
      `Error in Repository\nOperation: ${operation}\nRepositoy:${repositoryName}\nDetails:\n`,
      error
    );
    throw new RepositoryError(
      operation,
      error.message,
      500,
      `Error occurred while ${operation}`
    );
  }

  throw error;
}
