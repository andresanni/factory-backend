/* eslint-disable @typescript-eslint/no-unused-vars */
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
      
      //Crear un Rol Mock
      const mockRole = new Role("Admin");
      await roleRepository.save(mockRole);

      //Asignar permisos al Rol
      mockRole.setPermissions(mockPermissions);
      await roleRepository.save(mockRole);

      //Verificar la relación desde el lado del Permiso
      const savedPermissions = await repository.findAll(["roles"]);
      savedPermissions.forEach((permission) => {
        expect(permission.roles).toContainEqual({id:1, name:"Admin"});
      });

    //Verificar la relacion desde el lado del Rol   
      const savedRole: Role | null = await roleRepository.findOne({where:{id: mockRole.id}, relations:["permissions"]});
      if(!savedRole) throw new Error("Role not found");
      expect(savedRole.permissions).toHaveLength(mockPermissions.length);
    });
  });
});
