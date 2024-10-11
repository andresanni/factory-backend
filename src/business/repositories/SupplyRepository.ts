import { Supply } from "../entities/Supply";
import { DataSource, DeleteResult, Repository, UpdateResult } from "typeorm";
import { ICrudRepository } from "./ICrudRepository";
import { ErrorLayer } from "../../errors/AppError";
import { handleError } from "../../utils/errorHandlerUtil";

export class SupplyRepository implements ICrudRepository<Supply> {
  private repository: Repository<Supply>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Supply);
  }

  async findAll(): Promise<Supply[]> {
    try {
      return await this.repository.find({ relations: ["category"] });
    } catch (error) {
      handleError(
        "fetching supplies",
        "findAll",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async findById(id: number): Promise<Supply | null> {
    try {
      return await this.repository.findOneBy({ id });
    } catch (error) {
      handleError(
        "fetching supply by id",
        "findById",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async update(id: number, item: Supply): Promise<Supply | null> {
    try {
      const result: UpdateResult = await this.repository.update(id, item);
      return result.affected ? await this.findById(id) : null;
    } catch (error) {
      handleError(
        "updating supply",
        "update",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async save(supply: Supply): Promise<Supply> {
    try {
      return await this.repository.save(supply);
    } catch (error) {
      handleError(
        "saving supply",
        "save",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
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
      handleError(
        "deleting supply",
        "delete",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }
}
