import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { SupplyCategory } from "../entity/SupplyCategory";

export class SupplyCategoryRepository {
  private repository: Repository<SupplyCategory>;

  constructor() {
    this.repository = AppDataSource.getRepository(SupplyCategory);
  }

  async findAll(): Promise<SupplyCategory[]> {
    return this.repository.find({ relations: ["supplies"] });
  }

  async findById(id: number): Promise<SupplyCategory | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["supplies"],
    });
  }

  async save(supplyCategory: SupplyCategory): Promise<SupplyCategory> {
    return this.repository.save(supplyCategory);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
