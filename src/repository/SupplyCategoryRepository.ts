import { DataSource, Repository, UpdateResult, DeleteResult } from "typeorm";
import { SupplyCategory } from "../entity/SupplyCategory";
import { ICrudRepository } from "./ICrudRepository";
import { RepositoryError } from "../errors/RepositoryError";

export class SupplyCategoryRepository implements ICrudRepository<SupplyCategory> {
  private repository: Repository<SupplyCategory>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(SupplyCategory);
  }

  async findAll(): Promise<SupplyCategory[]> {
    try {
      return this.repository.find({ relations: ["supplies"] });
    } catch (error) {
      throw new RepositoryError(
        "Error fecthing supply categories",
        500,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  async findById(id: number): Promise<SupplyCategory | null> {
    try {
      return this.repository.findOneBy({ id });
    } catch (error) {
      throw new RepositoryError(
        "Error fecthing supply category",
        500,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  async update(id: number, item: SupplyCategory): Promise<SupplyCategory | null> {
    try {
      const result: UpdateResult = await this.repository.update(id, item);
      if (result.affected && result.affected > 0) {
        return await this.findById(id);
      }
      return null;
    } catch (error) {
      throw new RepositoryError(
        "Error updating supply category",
        500,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  async save(supplyCategory: SupplyCategory): Promise<SupplyCategory> {
    try{
      return this.repository.save(supplyCategory);
    }
    catch(error){
      throw new RepositoryError(
        "Error saving supply category",
        500,
        error instanceof Error ? error.message : "Unknown error"
      );
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
      throw new RepositoryError(
        "Error deleting supply category",
        500,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
}

