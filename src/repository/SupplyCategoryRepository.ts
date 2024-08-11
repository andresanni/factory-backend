import { DataSource, Repository, UpdateResult, DeleteResult } from "typeorm";
import { SupplyCategory } from "../entity/SupplyCategory";
import { ICrudRepository } from "./ICrudRepository";
import { parseError } from "./utils";


export class SupplyCategoryRepository implements ICrudRepository<SupplyCategory> {
  private repository: Repository<SupplyCategory>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(SupplyCategory);
  }

  async findAll(): Promise<SupplyCategory[]> {
    try {
      return this.repository.find({ relations: ["supplies"] });
    } catch (error) {
      const parsedError = parseError(error);
      throw new Error(`Error fetching supply categories: ${parsedError.message}`);
    }
  }

  async findById(id: number): Promise<SupplyCategory | null> {
    try {
      return this.repository.findOneBy({ id });
    } catch (error) {
      const parsedError = parseError(error);
      throw new Error(`Error fetching supply category: ${parsedError.message}`);
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
      const parsedError = parseError(error);
      throw new Error(`Error updating supply category: ${parsedError.message}`);
    }
  }

  async create(supplyCategory: SupplyCategory): Promise<SupplyCategory> {
    try{
      return this.repository.save(supplyCategory);
    }
    catch(error){
      const parsedError = parseError(error);
      throw new Error(`Error saving supply category: ${parsedError.message}`);
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
      const parsedError = parseError(error);
      throw new Error(`Error deleting supply category: ${parsedError.message}`);
    }
  }
}

