import { UserRepository } from "../UserRepository";
import { authTestDataSource } from "../../../config/data-source";
import { User } from "../../entities/User";
import { Role } from "../../entities/Role";
import { RepositoryLayerError } from "../../../errors/AppError";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let role: Role;

  beforeAll(async () => {
    await authTestDataSource.initialize();
    userRepository = new UserRepository(authTestDataSource);
  });

  afterAll(async () => {
    await authTestDataSource.destroy();
  });

  beforeEach(async () => {
    await authTestDataSource.synchronize(true);
    role = new Role("User");
    await authTestDataSource.getRepository(Role).save(role);
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const newUser = new User(
        "testuser",
        "hashedpassword",
        "testuser@example.com",
        role,
        "John",
        "Doe"
      );

      const savedUser = await userRepository.create(newUser);

      expect(savedUser).toHaveProperty("id");
      expect(savedUser.username).toBe("testuser");
      expect(savedUser.passwordHash).toBe("hashedpassword");
      expect(savedUser.email).toBe("testuser@example.com");
      expect(savedUser.name).toBe("John");
      expect(savedUser.surname).toBe("Doe");
      expect(savedUser.role?.name).toBe("User");
      console.log(savedUser);
    });

    it("should throw a RepositoryError when username already exists", async () => {
      const newUser = new User(
        "testuser",
        "hashedpassword",
        "testuser@example.com",
        role,
        "John",
        "Doe"
      );
      await authTestDataSource.getRepository(User).save(newUser);

      const newWrongUser = new User(
        "testuser",
        "hashedpassword",
        "testwronguser@example.com",
        role,
        "John",
        "Doe"
      );
      try {
        await userRepository.create(newWrongUser);
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryLayerError);
        if (error instanceof RepositoryLayerError) {
          expect(error.internalMessage).toContain(
            "SQLITE_CONSTRAINT: UNIQUE constraint failed"
          );
          expect(error.statusCode).toBe(500);
          expect(error.publicMessage).toBe(
            "Error occurred while creating user"
          );
        }
      }
    });
  });

  describe("find", () => {
    beforeEach(async () => {
      const newUser = new User(
        "testuser",
        "hashedpassword",
        "testuser@example.com",
        role,
        "John",
        "Doe"
      );
      await authTestDataSource.getRepository(User).save(newUser);
    });

    it("should find a user by username", async () => {
      const foundUser = await userRepository.findByUsername("testuser");
      if(!foundUser) throw new Error("No user found");
      expect(foundUser).toHaveProperty("id");
      expect(foundUser.username).toBe("testuser");
      expect(foundUser.passwordHash).toBe("hashedpassword");
      expect(foundUser.email).toBe("testuser@example.com");
      expect(foundUser.name).toBe("John");
      expect(foundUser.surname).toBe("Doe");
      expect(foundUser.role.name).toBe("User");
    });

    it("should find a user by valid id", async () => {
      const allUsers = await authTestDataSource
        .getRepository(User)
        .find({ relations: ["role"] });
      const userId = allUsers[0].id;
      if (!userId) throw new Error("No user found");
      const foundUser = await userRepository.findById(userId);
      expect(foundUser).toEqual(allUsers[0]);
    });

    it("should return null when user not found", async () => {
      const foundUser = await userRepository.findByUsername("nonexistentuser");
      expect(foundUser).toBeNull();
    });

    it("should return null when id not found", async () => {
      const result: { maxId: number } | undefined = await authTestDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .select("MAX(user.id)", "maxId")
        .getRawOne();
      if (!result) throw new Error("No user found");
      const maxUserId = result.maxId;
      const foundUser = await userRepository.findById(maxUserId + 1);
      expect(foundUser).toBeNull();
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      const newUser = new User(
        "testuser",
        "hashedpassword",
        "testuser@example.com",
        role,
        "John",
        "Doe"
      );
      await authTestDataSource.getRepository(User).save(newUser);
    });

    it("should delete user with valid id", async () => {
      const allUsers = await authTestDataSource
        .getRepository(User)
        .find({ relations: ["role"] });
      const userId = allUsers[0].id;
      if (!userId) throw new Error("No user found");
      const result = await userRepository.delete(userId);
      const foundUser = await userRepository.findById(userId);
      expect(foundUser).toBeNull();
      expect(result).toBe(true);
    });

    it("should return false when id not found", async () => {
      const result: { maxId: number } | undefined = await authTestDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .select("MAX(user.id)", "maxId")
        .getRawOne();
      if (!result) throw new Error("No user found");
      const maxUserId = result.maxId;
      const deleteResult = await userRepository.delete(maxUserId + 1);
      expect(deleteResult).toBe(false);
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      const newUser = new User(
        "testuser",
        "hashedpassword",
        "testuser@example.com",
        role,
        "John",
        "Doe"
      );
      await authTestDataSource.getRepository(User).save(newUser);
    });
    it("should update user with valid id", async () => {
      const allUsers = await authTestDataSource
        .getRepository(User)
        .find({ relations: ["role"] });
      const userId = allUsers[0].id;
      if (!userId) throw new Error("No user found");

      const userToUpdate = await authTestDataSource
        .getRepository(User)
        .findOne({
          where: { id: userId },
          relations: ["role"],
        });

      if (!userToUpdate) throw new Error("No user found");

      userToUpdate.username = "XXXXXXXXXXXXXXX";
      const updatedUser = await userRepository.update(userId, userToUpdate);
      expect(updatedUser?.username).toBe("XXXXXXXXXXXXXXX");
    });

    it("should return null when id not found", async () => {
      const result: { maxId: number } | undefined = await authTestDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .select("MAX(user.id)", "maxId")
        .getRawOne();
      if (!result) throw new Error("No user found");
      const maxUserId = result.maxId;

      const userToUpdate = await authTestDataSource
        .getRepository(User)
        .findOne({
          where: { id: maxUserId },
          relations: ["role"],
        });
      if (!userToUpdate) throw new Error("No user found");
      const updateResult = await userRepository.update(
        maxUserId + 1,
        userToUpdate
      );
      expect(updateResult).toBeNull();
    });

    it("should throw Repository Error when new username already exists", async () => {
      const secondUser = new User(
        "secondUser",
        "hashedpassword",
        "seconduser@example.com",
        role,
        "Second",
        "User"
      );
      await authTestDataSource.getRepository(User).save(secondUser);

      const allUsers = await authTestDataSource
        .getRepository(User)
        .find({ relations: ["role"] });
      const userId = allUsers[0].id;
      if (!userId) throw new Error("No user found");
      const userToUpdate = await authTestDataSource
        .getRepository(User)
        .findOne({
          where: { id: userId },
          relations: ["role"],
        });
      if (!userToUpdate) throw new Error("No user found");

      userToUpdate.username = "secondUser";
      try {
        await userRepository.update(userId, userToUpdate);
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryLayerError);
        if (error instanceof RepositoryLayerError) {
          expect(error.internalMessage).toContain(
            "SQLITE_CONSTRAINT: UNIQUE constraint failed"
          );
          expect(error.statusCode).toBe(500);
          expect(error.publicMessage).toBe(
            "Error occurred while updating user"
          );
        }
      }
    });
  });
});
