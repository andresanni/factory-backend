import { AppDataSource } from "../data-source";
import { Supply } from "../entity/Supply";
import { Repository } from "typeorm";

export class SupplyRepository {
  private repository: Repository<Supply>;

  constructor() {
    this.repository = AppDataSource.getRepository(Supply);
  }

  async findAll(): Promise<Supply[]> {
    return this.repository.find({ relations: ["category"] });
  }

  async findById(id: number): Promise<Supply | null> {
    return this.repository.findOneBy({ id });
  }

  async save(supply: Supply): Promise<Supply> {
    return this.repository.save(supply);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
