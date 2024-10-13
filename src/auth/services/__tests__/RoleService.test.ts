import { RoleRepository } from "../../repositories/RoleRepository";
import { authTestDataSource } from "../../../config/data-source";
import { RoleService } from "../RoleService";
import { Role } from "../../entities/Role";
import { AuthenticatedUser } from "../../types/AuthenticatedUser";
import { Permissions } from "../../types";
import { ServiceLayerError } from "../../../errors/AppError";
import { PermissionRepository } from "../../repositories/PermissionRepository";
import { Permission } from "../../entities/Permission";

describe("RoleService", () => {
  let repository: RoleRepository;
  let service: RoleService;
  let authenticatedUser: AuthenticatedUser;
  let permissionRepository: PermissionRepository;

  beforeAll(async () => {
    await authTestDataSource.initialize();
    repository = new RoleRepository(authTestDataSource);
    permissionRepository = new PermissionRepository(authTestDataSource);
    service = new RoleService(repository, permissionRepository);
  });

  beforeEach(async () => {
    await authTestDataSource.dropDatabase();
    await authTestDataSource.synchronize();

    authenticatedUser = {
      id: 1,
      username: "testUser1",
      role: "Admin",
      permissions: [
        Permissions.CREATE_ROLE,
        Permissions.READ_ROLE,
        Permissions.UPDATE_ROLE,
        Permissions.DELETE_ROLE,
      ],
    };

    await permissionRepository.create(new Permission(Permissions.CREATE_ROLE));
    await permissionRepository.create(new Permission(Permissions.READ_ROLE));
    await permissionRepository.create(new Permission(Permissions.UPDATE_ROLE));
    await permissionRepository.create(new Permission(Permissions.DELETE_ROLE));
  });

  afterAll(async () => {
    await authTestDataSource.destroy();
  });

  describe("create", () => {
    it("should create a new role wihout initial permissions", async () => {
      const roleName: string = "Test Role";
      await service.createRole(authenticatedUser, roleName);

      const allRoles: Role[] = await repository.findAll();
      expect(allRoles.length).toBe(1);
    });

    it("should throw an error if the user is not authorized", async () => {
      authenticatedUser.permissions = [];
      let err: ServiceLayerError | null = null;

      try {
        await service.createRole(authenticatedUser, "Test Role");
      } catch (error) {
        err = error as ServiceLayerError;
      }
      expect(err).toBeInstanceOf(ServiceLayerError);
      expect(err?.internalMessage).toBe(
        "Authorization error\n create:role isn't in user permissions. User permissions: empty"
      );
      expect(err?.statusCode).toBe(403);
    });

    it("should throw an error if the role already exists", async () => {
      const roleName: string = "Test Role";
      let err: ServiceLayerError | null = null;

      await service.createRole(authenticatedUser, roleName);
      try {
        await service.createRole(authenticatedUser, roleName);
      } catch (error) {
        err = error as ServiceLayerError;
      }
      expect(err).toBeInstanceOf(ServiceLayerError);
      expect((err as ServiceLayerError).internalMessage).toBe(
        "Role Test Role already exists"
      );
    });

    it("should create a new role with initial permissions", async () => {
      const roleName: string = "Test Role";
      const permissionsNames: Permissions[] = [
        Permissions.CREATE_ROLE,
        Permissions.READ_ROLE,
      ];
      await service.createRole(authenticatedUser, roleName, permissionsNames);
      const allRoles: Role[] = await repository.findAll(["permissions"]);
      console.log("All roles:", allRoles);
      expect(allRoles.length).toBe(1);
      const role = allRoles[0];
      expect(role.permissions?.length).toBe(2);
      expect(role.permissions?.[0].description).toBe(Permissions.CREATE_ROLE);
      expect(role.permissions?.[1].description).toBe(Permissions.READ_ROLE);
    });
  });

  describe("update", () => {
    describe("updateRolePermissions", () => {
      it("should update an existing role with new permissions successfully and not throw errors", async () => {
        const roleName: string = "Role to update";
        const initialPermissions: Permissions[] = [Permissions.UPDATE_ROLE];
        const newPermissions: Permissions[] = [
          Permissions.CREATE_ROLE,
          Permissions.READ_ROLE,
        ];

        await service.createRole(
          authenticatedUser,
          roleName,
          initialPermissions
        );

        const updatedRole = await service.updateRolePermissions(
          authenticatedUser,
          roleName,
          newPermissions
        );

        expect(updatedRole.permissions?.length).toBe(2);
        expect(
          updatedRole.permissions?.some(
            (p) => p.description === Permissions.CREATE_ROLE
          )
        ).toBe(true);
        expect(
          updatedRole.permissions?.some(
            (p) => p.description === Permissions.READ_ROLE
          )
        ).toBe(true);

        await expect(
          service.updateRolePermissions(
            authenticatedUser,
            roleName,
            newPermissions
          )
        ).resolves.not.toThrow();
      });
      it("should throw an error if the role doesn't exist", async () => {
        let err: ServiceLayerError | null = null;
        try {
          await service.updateRolePermissions(
            authenticatedUser,
            "Non-existent Role",
            []
          );
        } catch (error) {
          err = error as ServiceLayerError;
        }
        expect(err).toBeInstanceOf(ServiceLayerError);
        expect(err?.internalMessage).toBe("Role Non-existent Role not found");
        expect(err?.statusCode).toBe(404);
      });
      it("should throw an error if the user is not authorized", async () => {
        authenticatedUser.permissions = [];
        let err: ServiceLayerError | null = null;
        try {
          await service.updateRolePermissions(
            authenticatedUser,
            "Role to update",
            []
          );
        } catch (error) {
          err = error as ServiceLayerError;
        }
        expect(err).toBeInstanceOf(ServiceLayerError);
        expect(err?.internalMessage).toBe(
          "Authorization error\n update:role isn't in user permissions. User permissions: empty"
        );
        expect(err?.statusCode).toBe(403);
      });
      it("should throw an error if the new permissions are not valid", async () => {
        const roleName: string = "Role to update";
        const initialPermissions: Permissions[] = [Permissions.UPDATE_ROLE];
        const newPermissions: Permissions[] = [
          "Invalid Permission" as Permissions,
        ];
        let err: ServiceLayerError | null = null;

        await service.createRole(
          authenticatedUser,
          roleName,
          initialPermissions
        );
        try {
          await service.updateRolePermissions(
            authenticatedUser,
            roleName,
            newPermissions
          );
        } catch (error) {
          err = error as ServiceLayerError;
        }
        expect(err).toBeInstanceOf(ServiceLayerError);
        expect(err?.internalMessage).toBe(
          "Permission Invalid Permission not found"
        );
        expect(err?.statusCode).toBe(404);
      });
    });

    describe("updateRoleName", () => {
      it("should update the role name successfully and not throw errors", async () => {
        const roleName: string = "Role to update";
        const newName: string = "Updated Role";
        await service.createRole(authenticatedUser, roleName);

        const updatedRole = await service.updateRoleName(
          authenticatedUser,
          roleName,
          newName
        );
        expect(updatedRole.name).toBe(newName);
      });
    });
  });

  describe("read", () => {
    describe("getAllRoles", () => {
      beforeEach(async () => {
        await service.createRole(authenticatedUser, "Role 1");
        await service.createRole(authenticatedUser, "Role 2");
        const permissions: Permission[] = await permissionRepository.findAll();

        await service.updateRolePermissions(authenticatedUser, "Role 1", [
          permissions[0].description as Permissions,
          permissions[1].description as Permissions,
        ]);
        await service.updateRolePermissions(authenticatedUser, "Role 2", [
          permissions[2].description as Permissions,
          permissions[3].description as Permissions,
        ]);
      });

      it("should return all roles successfully and not throw errors", async () => {
        const roles: Role[] = await service.getAllRoles(authenticatedUser);
        expect(roles.length).toBe(2);
      });

      it("should return all roles with relations successfully and not throw errors", async () => {
        const roles: Role[] = await service.getAllRoles(authenticatedUser, [
          "permissions",
        ]);

        expect(roles.length).toBe(2);
        expect(roles[0].permissions?.length).toBe(2);
        expect(roles[1].permissions?.length).toBe(2);
      });
    });
  });

  describe("delete", () => {
    it("should delete a role successfully and not throw errors", async () => {
      await service.createRole(authenticatedUser, "Role to delete");
      const rolesBefore: Role[] = await repository.findAll();
      await service.deleteRole(authenticatedUser, "Role to delete");
      const rolesAfter: Role[] = await repository.findAll();
      expect(rolesAfter.length).toBe(0);
      expect(rolesBefore.length).toBe(1);
    });
  });
});
