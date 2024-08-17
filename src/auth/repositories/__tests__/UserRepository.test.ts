import { UserRepository } from "../UserRepository";
import { authTestDataSource } from "../../../config/data-source";
import { User } from "../../entities/User";
import { Role } from "../../entities/Role";

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    await authTestDataSource.initialize();
    userRepository = new UserRepository(authTestDataSource);
  });


  afterAll(async () => {
    await authTestDataSource.destroy();
  });

  it("should create a new user", async () => {
    const role = new Role("User");
    await authTestDataSource.getRepository(Role).save(role);

    const newUser = new User(
      "testuser",
      "hashedpassword",
      "testuser@example.com",
      "John",
      "Doe",
      role
    );

    const savedUser = await userRepository.create(newUser);

    expect(savedUser).toHaveProperty("id");
    expect(savedUser.username).toBe("testuser");
    expect(savedUser.passwordHash).toBe("hashedpassword");
    expect(savedUser.email).toBe("testuser@example.com");
    expect(savedUser.name).toBe("John");
    expect(savedUser.surname).toBe("Doe");
    expect(savedUser.role?.name).toBe("User");
  });
});
