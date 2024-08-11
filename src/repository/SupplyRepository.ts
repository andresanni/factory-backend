import { Supply } from "../entity/Supply";
import { DataSource, DeleteResult, Repository, UpdateResult } from "typeorm";
import { ICrudRepository } from "./ICrudRepository";
import { parseError } from "./utils";

export class SupplyRepository implements ICrudRepository<Supply> {
  private repository: Repository<Supply>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Supply);
  }

  async findAll(): Promise<Supply[]> {
    try {
      return this.repository.find({ relations: ["category"] });
    } catch (error) {
      const parsedError = parseError(error);
      throw new Error(`Error fetching supplies: ${parsedError.message}`);
    }
  }

  async findById(id: number): Promise<Supply | null> {
    try {
      return this.repository.findOneBy({ id });
    } catch (error) {
      const parsedError = parseError(error);
      throw new Error(`Error fetching supply: ${parsedError.message}`);
    }
  }

  async update(id: number, item: Supply): Promise<Supply | null> {
    try {
      const result: UpdateResult = await this.repository.update(id, item);
      if (result.affected && result.affected > 0) {
        return await this.findById(id);
      }
      return null;
    } catch (error) {
      const parsedError = parseError(error);
      throw new Error(`Error updating supply: ${parsedError.message}`);
    }
  }

  async create(supply: Supply): Promise<Supply> {
    try{
      return this.repository.save(supply);
    }
    catch(error){
      const parsedError = parseError(error);
      throw new Error(`Error saving supply : ${parsedError.message}`);
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
      throw new Error(`Error deleting supply: ${parsedError.message}`);
    }
  }
}
