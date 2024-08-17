import { DataSource, Repository } from "typeorm";
import { User } from "../entities/User";
import { handleError } from "../../utils/respositoryUtils";

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async create(user: User): Promise<User> {
    try {
      return await this.repository.save(user);
    } catch (error) {
      handleError("creating user", error, this.constructor.name);
    }
  }
  async findById(id: number): Promise<User | null> {
    try {
      return await this.repository.findOneBy({ id });
    } catch (error) {
      handleError("fetching user by id", error, this.constructor.name);
    }
  }
  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.repository.findOneBy({ username });
    } catch (error) {
      handleError("fetching user by username", error, this.constructor.name);
    }
  }
  async findAll(): Promise<User[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      handleError("fetching users", error, this.constructor.name);
    }
  }
  async update(user: User): Promise<User> {
    try {
      return await this.repository.save(user);
    } catch (error) {
      handleError("updating user", error, this.constructor.name);
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      handleError("deleting user", error, this.constructor.name);
    }
  }
}
