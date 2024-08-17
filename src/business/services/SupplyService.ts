import { ICrudService } from "./ICrudService";
import { Supply } from "../business/entity/Supply";
import { RepositoryError } from "../business/errors/RepositoryError";
import { SupplyRepository } from "../business/repository/SupplyRepository";
import { ErrorSource, ServiceError } from "../business/errors/ServiceError";
import StatusCode from "status-code-enum";

export class SupplyService implements ICrudService<Supply> {
  private repository: SupplyRepository;

  constructor(repository: SupplyRepository) {
    this.repository = repository;
  }

  private handleError(operation: string, error: unknown, criteria?:string): never {
    if (error instanceof RepositoryError) {
      throw ServiceError.fromRepositoryError(error, criteria);
    }
    console.error(`Error in SupplyService, ${operation} :`, error);
    throw new ServiceError(
      `Error ${operation}`,
      StatusCode.ServerErrorInternal,
      ErrorSource.Service,
      error instanceof Error ? error.message : "Unkown error"
    );
  }

  async findAll(): Promise<Supply[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      this.handleError("fetching supplies", error);
    }
  }

  async findById(id: number): Promise<Supply | null> {
    try{
      return await this.repository.findById(id);
    }
    catch(error){
      this.handleError("fetching supply", error, `id: ${id}`);
    }
  }

  async create(item: Supply): Promise<Supply | RepositoryError> {
    try{
      return await this.repository.save(item);
    }
    catch(error){
      this.handleError("saving supply", error);
    }
  }
  
  update(_id: number, _item: Supply): Promise<Supply | RepositoryError | null> {
    throw new Error("Method not implemented.");
  }
  delete(_id: number): Promise<boolean | RepositoryError> {
    throw new Error("Method not implemented.");
  }
}
