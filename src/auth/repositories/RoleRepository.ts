import {
  Repository,
  DataSource,
  FindOptionsRelations,
  UpdateResult,
} from "typeorm";
import { Role } from "../entities/Role";
import { handleError } from "../../utils/errorHandlerUtil";
import { ErrorLayer } from "../../errors/AppError";

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
      return await this.repository.find({
        relations: this.buildRelations(relations),
      });
    } catch (error) {
      handleError(
        "fetching all roles",
        "findAll()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async findById(
    id: number,
    relations: RoleRelations[] = []
  ): Promise<Role | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: this.buildRelations(relations),
      });
    } catch (error) {
      handleError(
        "fetching role by id",
        "findById()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async findByName(name: string): Promise<Role | null> {
    try {
      return await this.repository.findOneBy({ name });
    } catch (error) {
      handleError(
        "fetching role by name",
        "findByName()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async create(role: Role): Promise<Role> {
    try {
      return await this.repository.save(role);
    } catch (error) {
      handleError(
        "creating role",
        "create()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async update(id: number, item: Role): Promise<Role | null> {
    try {
      const existingRole = await this.repository.findOne({ where: { id }, relations: ["permissions"] });
      if (!existingRole) {
        throw new Error(`Role with id ${id} not found`);
      }
      Object.assign(existingRole, item);
      const updatedRole = await this.repository.save(existingRole);
      return updatedRole;
    } catch (error) {
      handleError(
        "updating role",
        "update()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? true : false;
    } catch (error) {
      handleError(
        "deleting role",
        "delete()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }
}
