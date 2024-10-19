import { AuthenticatedUser } from "../types/AuthenticatedUser";
import { Permissions } from "../types";
import { Permission } from "../entities/Permission";
import { ErrorLayer, RepositoryLayerError } from "../../errors/AppError";
import { handleError } from "../../utils/errorHandlerUtil";
import { PermissionRepository } from "../repositories/PermissionRepository";
import { checkAuthorization } from "../../utils/serviceUtils";

export class PermissionService {
  private permissionRepository: PermissionRepository;

  constructor(permissionRepository: PermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async getAllPermissions(
    authenticatedUser: AuthenticatedUser
  ): Promise<Permission[]> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.READ_PERMISSION,
        statusCode
      );
      return await this.permissionRepository.findAll();
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "fetching all permissions",
          "getAllPermissions()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async getPermissionByName(
    authenticatedUser: AuthenticatedUser,
    permissionName: string
  ): Promise<Permission | null> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.READ_PERMISSION,
        statusCode
      );
      return await this.permissionRepository.findByName(permissionName);
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "fetching permission by name",
          "getPermissionByName()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async updatePermission(
    authenticatedUser: AuthenticatedUser,
    permissionName: string,
    newDescription: string
  ): Promise<Permission> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.UPDATE_PERMISSION,
        statusCode
      );
      const permission: Permission | null =
        await this.permissionRepository.findByName(permissionName);

      if (!permission) {
        statusCode.value = 404;
        throw new Error(`Permission ${permissionName} not found`);
      }
      permission.description = newDescription;

      if (permission.id !== undefined) {
        const updatedPermission = await this.permissionRepository.update(
          permission.id,
          permission
        );
        if (!updatedPermission) {
          statusCode.value = 500;
          throw new Error(`Permission ${permissionName} could not be updated`);
        }
        return updatedPermission;
      } else {
        throw new Error("Permission ID is undefined");
      }
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "updating permission",
          "updatePermission()",
          error,
          statusCode.value,
          ErrorLayer.SERVICE,
          this.constructor.name
        );
      }
      throw error;
    }
  }

  async deletePermission(
    authenticatedUser: AuthenticatedUser,
    permissionName: string
  ): Promise<void> {
    const statusCode: { value: number } = { value: 500 };
    try {
      checkAuthorization(
        authenticatedUser,
        Permissions.DELETE_PERMISSION,
        statusCode
      );
      const permission: Permission | null =
        await this.permissionRepository.findByName(permissionName);
      if (!permission) {
        statusCode.value = 404;
        throw new Error(`Permission ${permissionName} not found`);
      }
      if (permission.id !== undefined) {
        await this.permissionRepository.delete(permission.id);
      } else {
        throw new Error("Permission ID is undefined");
      }
    } catch (error) {
      if (error instanceof RepositoryLayerError) {
        throw error;
      }
      if (error instanceof Error) {
        handleError(
          "deleting permission",
          "deletePermission()",
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
