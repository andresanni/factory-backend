import { Repository, DataSource, FindOptionsRelations } from "typeorm";
import { Role } from "../entities/Role";
import { handleError } from "../../utils/respositoryUtils";

export type RoleRelations = "users" | "permissions";

export class RoleRepository {
  private repository: Repository<Role>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Role);
  }

  private buildRelations(
    relations: RoleRelations[]
  ): FindOptionsRelations<Role> {
    return relations.reduce<FindOptionsRelations<Role>>((acc, relation) => {
      acc[relation] = true;
      return acc;
    }, {});
  }

  async findAll(relations: RoleRelations[] = []): Promise<Role[]> {
    try {
      const roles = await this.repository.find({
        relations: this.buildRelations(relations),
      });
      return roles;
    } catch (error) {
      handleError("Error fetching all roles ", error, this.constructor.name);
    }
  }

  async findById(
    id: number,
    relations: RoleRelations[] = []
  ): Promise<Role | null> {
    try {
      const role = await this.repository.findOne({
        where: { id },
        relations: this.buildRelations(relations),
      });
      return role || null;
    } catch (error) {
      handleError("Error fetching role by id ", error, this.constructor.name);
    }
  }

  async create(role: Role): Promise<Role> {
    try {
      return await this.repository.save(role);
    } catch (error) {
      handleError("Error creating role ", error, this.constructor.name);
    }
  }
}
