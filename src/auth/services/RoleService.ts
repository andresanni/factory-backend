import { RoleRepository } from "../repositories/RoleRepository";
import { Role } from "../entities/Role";
import { AuthenticatedUser } from "../types/AuthenticatedUser";
import { Permissions } from "../types";
import { ErrorLayer, RepositoryLayerError } from "../../errors/AppError";
import { handleError } from "../../utils/errorHandlerUtil";

export class RoleService {
  private roleRepository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async createRole(
    roleName: string,
    authenticatedUser: AuthenticatedUser
  ): Promise<Role> {
    let statusCode: number = 500;
    try {
      const authorized: boolean = authenticatedUser.permissions.includes(
        Permissions.CREATE_ROLE
      );
      if (!authorized) {
        //Should create ServiceError and use details to create instance
        statusCode = 403;
        throw new Error(`Role ${roleName} already exists`);
      }
      const existingRole: Role | null = await this.roleRepository.findByName(
        roleName
      );
      if (existingRole) {
        //Should create ServiceError and use details to create instance
        statusCode = 400;
        throw new Error(`Role ${roleName} already exists`);
      }

      const savedRole = await this.roleRepository.create(new Role(roleName));
      return savedRole;
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "creating role",
          "createRole()",
          error,
          statusCode,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }
}
