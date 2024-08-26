/* eslint-disable @typescript-eslint/no-unused-vars */
import { Permission } from "../../entities/Permission";
import { RoleRepository } from "../RoleRepository";
import { User } from "../../entities/User";
import { authTestDataSource } from "../../../config/data-source";
import { Permissions } from "../../types";
import { Role } from "../../entities/Role";
import { Repository } from "typeorm";
import { RoleRelations } from "../RoleRepository";
import { RepositoryLayerError } from "../../../errors/AppError";

describe("RoleRepository", () => {
  let roleRepository: RoleRepository;
  let dataSourceRepository: Repository<Role>;
  let permissions: Permission[];
  let users: User[];
  let role: Role;

  beforeAll(async () => {
    await authTestDataSource.initialize();
    roleRepository = new RoleRepository(authTestDataSource);
    dataSourceRepository = authTestDataSource.getRepository(Role);
  });

  afterAll(async () => {
    await authTestDataSource.destroy();
  });

  beforeEach(async () => {
    //Clean Database
    await authTestDataSource.synchronize(true);
    //Create mock permissions
    permissions = [
      new Permission(Permissions.CREATE_USER),
      new Permission(Permissions.READ_USER),
      new Permission(Permissions.UPDATE_USER),
      new Permission(Permissions.DELETE_USER),
    ];
    //Save permissios in ddbb
    await authTestDataSource.getRepository(Permission).save(permissions);
    //Create new role
    role = new Role("admin");
    //Save role in bbdd
    await dataSourceRepository.save(role);
    //Create mock users
    users = [
      new User(
        "testuser1",
        "hashedpassword",
        "testuser1@example.com",
        role,
        "John",
        "Doe"
      ),
      new User(
        "testuser2",
        "hashedpassword2",
        "testuser2@example.com",
        role,
        "John2",
        "Doe2"
      ),
    ];
    //Save users in ddbb
    await authTestDataSource.getRepository(User).save(users);
    //Add permissions and users to Role
    role.setPermissions(permissions);
    role.setUsers(users);
    //save role in ddbb
    await dataSourceRepository.save(role);
  });

  describe("find", () => {
    describe("all", () => {
      it("should return all roles with users populated", async () => {
        const fromDataSourceRepository = await dataSourceRepository.find({
          relations: ["users"],
        });

        const result = await roleRepository.findAll(["users"]);
        expect(result).toEqual(fromDataSourceRepository);

        const expectedResult = [
          {
            id: 1,
            name: "admin",
            users: [
              {
                id: 1,
                username: "testuser1",
                email: "testuser1@example.com",
                name: "John",
                surname: "Doe",
                passwordHash: "hashedpassword",
              },
              {
                id: 2,
                username: "testuser2",
                email: "testuser2@example.com",
                name: "John2",
                surname: "Doe2",
                passwordHash: "hashedpassword2",
              },
            ],
          },
        ];

        expect(result).toEqual(expectedResult);
      });

      it("should return all roles with permissions populated", async () => {
        const fromDataSourceRepository = await dataSourceRepository.find({
          relations: ["permissions"],
        });

        const result = await roleRepository.findAll(["permissions"]);
        expect(result).toEqual(fromDataSourceRepository);

        const expectedResult = [
          {
            id: 1,
            name: "admin",
            permissions: [
              {
                id: 1,
                description: Permissions.CREATE_USER,
              },
              {
                id: 2,
                description: Permissions.READ_USER,
              },
              {
                id: 3,
                description: Permissions.UPDATE_USER,
              },
              {
                id: 4,
                description: Permissions.DELETE_USER,
              },
            ],
          },
        ];

        expect(result).toEqual(expectedResult);
      });

      it("should return all roles without population", async () => {
        const result = await roleRepository.findAll();
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({ id: 1, name: "admin" });
      });

      it("should throw RepositoryError when relation is not valid", async () => {
        try {
          await roleRepository.findAll(["invalidRelation" as RoleRelations]);
          fail("It should have thrown an error");
        } catch (error) {
          expect(error).toBeInstanceOf(RepositoryLayerError);
        }
      });
    });

    describe("by id", () => {
      it("should return role with users populated", async () => {
        const result = await roleRepository.findById(1, ["users"]);
        expect(result).toEqual({
          id: 1,
          name: "admin",
          users: [
            {
              id: 1,
              username: "testuser1",
              email: "testuser1@example.com",
              name: "John",
              surname: "Doe",
              passwordHash: "hashedpassword",
            },
            {
              id: 2,
              username: "testuser2",
              email: "testuser2@example.com",
              name: "John2",
              surname: "Doe2",
              passwordHash: "hashedpassword2",
            },
          ],
        });
      });

      it("should return role with permissions populated", async () => {
        const result = await roleRepository.findById(1, ["permissions"]);
        expect(result).toEqual({
          id: 1,
          name: "admin",
          permissions: [
            {
              id: 1,
              description: Permissions.CREATE_USER,
            },
            {
              id: 2,
              description: Permissions.READ_USER,
            },
            {
              id: 3,
              description: Permissions.UPDATE_USER,
            },
            {
              id: 4,
              description: Permissions.DELETE_USER,
            },
          ],
        });
      });

      it("should return null with not valid id", async()=>{
        const result = await roleRepository.findById(2, ["permissions"]);
        expect(result).toBeNull();
      });
    });
  });

  describe("create", () => {
    it("should create a new role", async () => {
      //Create new role object
      const newRole = new Role("user");
      //Add pemissions to thr role object
      newRole.setPermissions([permissions[0], permissions[1]]);
      //Save using repository method
      const result = await roleRepository.create(newRole);
      //Find using DataSource repository method
      const roles = await dataSourceRepository.find();
      //Find the added role by its id
      const addedRole = await dataSourceRepository.findOneBy({ id: result.id });

      expect(roles).toHaveLength(2);
    });
  });

  describe("update", () => {
    it("should update a role", async () => {
      const id = 1;
      const changedRole = new Role("changedAdmin");
      const result = await roleRepository.update(id, changedRole);
      const expectedRole = { ...changedRole, id: 1 };
      expect(result).toEqual(expectedRole);
    });
  });

  describe("delete", () => {
    it("should throw a RepositoryError when trying to delete a role with foreign key constraints", async () => {
      const id = role.id;
      try {
        if (!id) throw new Error("Id not found");
        await roleRepository.delete(id);
        fail("Expected error not thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryLayerError);
        if (error instanceof RepositoryLayerError) {
          expect(error.publicMessage).toContain("Error occurred while deleting role");
          expect(error.internalMessage).toContain(
            "FOREIGN KEY constraint failed"
          );
        }
      }
    });
  });
});
