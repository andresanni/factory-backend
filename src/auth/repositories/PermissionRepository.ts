import { DataSource, Repository } from "typeorm";
import { Permission } from "../entities/Permission";
import { FindOptionsRelations, UpdateResult } from "typeorm";
import { handleError } from "../../utils/errorHandlerUtil";
import { ErrorLayer } from "../../errors/AppError";

export type PermissionRelations = "roles";

export class PermissionRepository {
  private repository: Repository<Permission>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Permission);
  }

  private buildRelations(
    relations: PermissionRelations[]
  ): FindOptionsRelations<Permission> {
    return relations.reduce<FindOptionsRelations<Permission>>(
      (acc, relation) => {
        acc[relation] = true;
        return acc;
      },
      {}
    );
  }

  async findAll(relations: PermissionRelations[] = []): Promise<Permission[]> {
    try {
      return await this.repository.find({
        relations: this.buildRelations(relations),
      });
    } catch (error) {
      handleError(
        "fetching all permissions",
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
    relations: PermissionRelations[] = []
  ): Promise<Permission | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: this.buildRelations(relations),
      });
    } catch (error) {
      handleError(
        "fetching permission by id",
        "findById()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async create(permission: Permission): Promise<Permission> {
    try {
      return await this.repository.save(permission);
    } catch (error) {
      handleError(
        "creating permission",
        "create()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async update(id: number, item: Permission): Promise<Permission | null> {
    try {
      const result: UpdateResult = await this.repository.update(id, item);
      return result.affected ? await this.findById(id) : null;
    } catch (error) {
      handleError(
        "updating permission",
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
        "deleting permission",
        "delete()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }

  async findByName(name: string): Promise<Permission | null> {
    try {
      return await this.repository.findOne({ where: { description: name } });
    } catch (error) {
      handleError(
        "fetching permission by name",
        "findByName()",
        error,
        500,
        ErrorLayer.REPOSITORY,
        this.constructor.name
      );
    }
  }
}
