import { Repository } from "typeorm";
import { PermissionRepository } from "../PermissionRepository";
import { authTestDataSource } from "../../../config/data-source";
import { Permission } from "../../entities/Permission";
import { Role } from "../../entities/Role";
import { Permissions } from "../../types";

describe("PermissionRepository", () => {
  let repository: PermissionRepository;
  let dataSourceRepository: Repository<Permission>;
  let roleRepository: Repository<Role>;
  let mockPermissions: Permission[];

  beforeAll(async () => {
    await authTestDataSource.initialize();
    repository = new PermissionRepository(authTestDataSource);
    dataSourceRepository = authTestDataSource.getRepository(Permission);
    roleRepository = authTestDataSource.getRepository(Role);
  });

  afterAll(async () => {
    await authTestDataSource.destroy();
  });

  beforeEach(async () => {
    await authTestDataSource.synchronize(true);
    mockPermissions = [
      new Permission(Permissions.CREATE_ROLE),
      new Permission(Permissions.READ_ROLE),
      new Permission(Permissions.UPDATE_ROLE),
      new Permission(Permissions.DELETE_ROLE),
    ];
    await dataSourceRepository.save(mockPermissions);
  });

  describe("find", () => {
    describe("all", () => {
      it("should return all permissions", async () => {
        const permissions = await repository.findAll();
        expect(permissions).toHaveLength(mockPermissions.length);
        expect(permissions).toEqual(mockPermissions);
      });
    });
  });

  describe("Relationship between Role and Permission", () => {
    it("should create a role with permissions and verify the relationship", async () => {
      const mockRole = new Role("Admin");
      await roleRepository.save(mockRole);

      mockRole.setPermissions(mockPermissions);
      await roleRepository.save(mockRole);

      const savedPermissions = await repository.findAll(["roles"]);
      savedPermissions.forEach((permission) => {
        expect(permission.roles).toContainEqual({ id: 1, name: "Admin" });
      });

      const savedRole: Role | null = await roleRepository.findOne({
        where: { id: mockRole.id },
        relations: ["permissions"],
      });
      if (!savedRole) throw new Error("Role not found");
      expect(savedRole.permissions).toHaveLength(mockPermissions.length);
    });
  });

  describe("findByName", () => {
    it("should return the correct permission when it exists", async () => {
      const permission = await repository.findByName(Permissions.CREATE_ROLE);
      expect(permission).not.toBeNull();
      expect(permission?.description).toBe(Permissions.CREATE_ROLE);
    });

    it("should return null when the permission does not exist", async () => {
      const permission = await repository.findByName("nonexistent:permission");
      expect(permission).toBeNull();
    });
  });
});
