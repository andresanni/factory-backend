import { Supply } from "../entities/Supply";
import { DataSource, DeleteResult, Repository, UpdateResult } from "typeorm";
import { ICrudRepository } from "./ICrudRepository";
import { RepositoryError } from "../errors/RepositoryError";

export class SupplyRepository implements ICrudRepository<Supply> {
  private repository: Repository<Supply>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Supply);
  }

  private handleError(operation: string, error: unknown): never {
    console.error(`Error in SupplyRepository\nOperation: ${operation}\nDetails: \n `, error);
    throw new RepositoryError(
      `Error ${operation}`,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  async findAll(): Promise<Supply[]> {
    try {
      return await this.repository.find({ relations: ["category"] });
    } catch (error) {
      this.handleError("fetching supplies", error);
    }
  }

  async findById(id: number): Promise<Supply | null> {
    try {
      return await this.repository.findOneBy({ id });
    } catch (error) {
      this.handleError("fetching supply", error);
    }
  }

  async update(id: number, item: Supply): Promise<Supply | null> {
    try {
      const result: UpdateResult = await this.repository.update(id, item);
      return result.affected ? await this.findById(id) : null;
    } catch (error) {
      this.handleError("updating supply", error);
    }
  }

  async save(supply: Supply): Promise<Supply> {
    try {
      return await this.repository.save(supply);
    } catch (error) {
      this.handleError("saving supply", error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result: DeleteResult = await this.repository.delete(id);
      return (
        result.affected !== undefined &&
        result.affected !== null &&
        result.affected > 0
      );
    } catch (error) {
      this.handleError("deleting supply", error);
    }
  }
}
