import { RoleRepository } from "../repositories/RoleRepository";
import { Role } from "../entities/Role";
import { AuthenticatedUser } from "../types/AuthenticatedUser";
import { Permissions } from "../types";
import { PermissionRepository } from "../repositories/PermissionRepository";
import { Permission } from "../entities/Permission";
import { ErrorLayer, RepositoryLayerError } from "../../errors/AppError";
import { handleError } from "../../utils/errorHandlerUtil";
import { RoleRelations } from "../repositories/RoleRepository";
import { checkAuthorization } from "../../utils/serviceUtils";

export class RoleService {
  private roleRepository: RoleRepository;
  private permissionRepository: PermissionRepository;

  constructor(
    roleRepository: RoleRepository,
    permissionRepository: PermissionRepository
  ) {
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
  }

  async resolvePermissions(
    permissionsNames: Permissions[],
    statusCode: { value: number }
  ): Promise<Permission[]> {
    const permissionsPromises = permissionsNames.map(async (permissionName) => {
      const permission =
        await this.permissionRepository.findByName(permissionName);
      if (!permission) {
        statusCode.value = 404;
        throw new Error(`Permission ${permissionName} not found`);
      }
      return permission;
    });
    const resolvedPermissions = await Promise.all(permissionsPromises);
    return resolvedPermissions;
  }

  async createRole(
    authenticatedUser: AuthenticatedUser,
    roleName: string,
    permissionsNames?: Permissions[]
  ): Promise<Role> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.CREATE_ROLE,
        statusCode
      );

      const existingRole: Role | null =
        await this.roleRepository.findByName(roleName);

      if (existingRole) {
        statusCode.value = 400;
        throw new Error(`Role ${roleName} already exists`);
      }

      const newRole = new Role(roleName);

      if (permissionsNames) {
        const resolvedPermissions = await this.resolvePermissions(
          permissionsNames,
          statusCode
        );
        newRole.setPermissions(resolvedPermissions);
      }

      const savedRole = await this.roleRepository.create(newRole);
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
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async updateRolePermissions(
    authenticatedUser: AuthenticatedUser,
    roleName: string,
    permissionsNames: Permissions[]
  ): Promise<Role> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.UPDATE_ROLE,
        statusCode
      );
      const role: Role | null = await this.roleRepository.findByName(roleName);

      if (!role) {
        statusCode.value = 404;
        throw new Error(`Role ${roleName} not found`);
      }
      const resolvedPermissions = await this.resolvePermissions(
        permissionsNames,
        statusCode
      );
      role.setPermissions(resolvedPermissions);

      if (role.id !== undefined) {
        const updatedRole = await this.roleRepository.update(role.id, role);
        if (!updatedRole) {
          statusCode.value = 500;
          throw new Error(`Role ${roleName} couldn't be updated`);
        }
        return updatedRole;
      } else {
        throw new Error("Role ID is undefined");
      }
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "updating role permissions",
          "updateRolePermissions()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async updateRoleName(
    authenticatedUser: AuthenticatedUser,
    roleName: string,
    newName: string
  ): Promise<Role> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.UPDATE_ROLE,
        statusCode
      );
      const role: Role | null = await this.roleRepository.findByName(roleName);

      if (!role) {
        statusCode.value = 404;
        throw new Error(`Role ${roleName} not found`);
      }
      role.name = newName;

      if (role.id !== undefined) {
        const updatedRole = await this.roleRepository.update(role.id, role);
        if (!updatedRole) {
          statusCode.value = 500;
          throw new Error(`Role ${roleName} couldn't be updated`);
        }
        return updatedRole;
      } else {
        throw new Error("Role ID is undefined");
      }
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "updating role name",
          "updateRoleName()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async getAllRoles(
    authenticatedUser: AuthenticatedUser,
    relations: RoleRelations[] = []
  ): Promise<Role[]> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(authenticatedUser, Permissions.READ_ROLE, statusCode);
      return await this.roleRepository.findAll(relations);
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "fetching all roles",
          "getAllRoles()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async getRoleByName(
    authenticatedUser: AuthenticatedUser,
    roleName: string,
    relations: RoleRelations[] = []
  ): Promise<Role | null> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(authenticatedUser, Permissions.READ_ROLE, statusCode);
      return await this.roleRepository.findByName(roleName, relations);
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "fetching role by name",
          "getRoleByName()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async deleteRole(
    authenticatedUser: AuthenticatedUser,
    roleName: string
  ): Promise<void> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.DELETE_ROLE,
        statusCode
      );
      const role: Role | null = await this.roleRepository.findByName(roleName);
      if (!role) {
        statusCode.value = 404;
        throw new Error(`Role ${roleName} not found`);
      }
      if (role.id !== undefined) {
        await this.roleRepository.delete(role.id);
      } else {
        throw new Error("Role ID is undefined");
      }
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "deleting role",
          "deleteRole()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }
}
