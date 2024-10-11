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
      permissions: [Permissions.CREATE_ROLE, Permissions.UPDATE_ROLE],
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

  describe("assignPermissionsToRole", () => {
    it("should assign existing permissions to an existing role successfully", async () => {
      const roleName: string = "New Role to update";
      const permissionsNamesToAssign: Permissions[] = [
        Permissions.CREATE_ROLE,
        Permissions.READ_ROLE,
      ];

      await service.createRole(authenticatedUser, roleName, [
        Permissions.UPDATE_ROLE,
      ]);
      const updatedRole = await service.assignPermissionsToRole(
        authenticatedUser,
        roleName,
        permissionsNamesToAssign
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
    });

    it("should not throw an error when assigning existing permissions to an existing role", async () => {
      const roleName: string = "Existing Role";
      const permissionsNames: Permissions[] = [
        Permissions.CREATE_ROLE,
        Permissions.READ_ROLE,
      ];

      await service.createRole(authenticatedUser, roleName);

      await expect(
        service.assignPermissionsToRole(
          authenticatedUser,
          roleName,
          permissionsNames
        )
      ).resolves.not.toThrow();
    });

    it("should throw an error if the user does not have the UPDATE_ROLE permission", async () => {
      const roleName: string = "Role without update permission";
      const permissionsNames: Permissions[] = [
        Permissions.CREATE_ROLE,
        Permissions.READ_ROLE,
      ];

      authenticatedUser.permissions = authenticatedUser.permissions.filter(
        (permission) => permission !== Permissions.UPDATE_ROLE
      );
      await service.createRole(authenticatedUser, roleName);

      let err: ServiceLayerError | null = null;

      try {
        await service.assignPermissionsToRole(
          authenticatedUser,
          roleName,
          permissionsNames
        );
      } catch (error) {
        err = error as ServiceLayerError;
      }
      expect(err).toBeInstanceOf(ServiceLayerError);
      expect((err as ServiceLayerError).internalMessage).toBe(
        "Authorization error\n update:role isn't in user permissions. User permissions: create:role"
      );
      expect((err as ServiceLayerError).statusCode).toBe(403);
    });
  });
});
