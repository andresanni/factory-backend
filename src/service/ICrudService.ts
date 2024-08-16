import { RepositoryError } from "../errors/RepositoryError";

export interface ICrudService<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(item: T): Promise<T | RepositoryError>;
  update(id: number, item: T): Promise<T | null | RepositoryError>;
  delete(id: number): Promise<boolean | RepositoryError>;
}