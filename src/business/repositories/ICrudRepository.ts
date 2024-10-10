export interface ICrudRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  save(item: T): Promise<T>;
  update(id: number, item: T): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
