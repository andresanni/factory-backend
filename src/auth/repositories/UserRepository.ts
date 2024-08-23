import { DataSource, Repository } from "typeorm";
import { User } from "../entities/User";
import { handleError } from "../../utils/respositoryUtils";
import { UpdateResult, DeleteResult } from "typeorm";

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
      return await this.repository.findOne({
        where: { id },
        relations: ["role"],
      });
    } catch (error) {
      handleError("fetching user by id", error, this.constructor.name);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.repository.findOne({
        where: { username },
        relations: ["role"],
      });
    } catch (error) {
      handleError("fetching user by username", error, this.constructor.name);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.repository.find({relations:["role"]});
    } catch (error) {
      handleError("fetching users", error, this.constructor.name);
    }
  }

  async update(id: number, item: User): Promise<User | null> {
    try {
      const result: UpdateResult = await this.repository.update(id, item);
      return result.affected ? await this.findById(id) : null;
    } catch (error) {
      handleError("updating user", error, this.constructor.name);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result: DeleteResult = await this.repository.delete(id);
      return (
        result.affected !== undefined &&
        result.affected !== null &&
        result.affected > 0
      );
    } catch (error) {
      handleError("deleting user", error, this.constructor.name);
    }
  }
}
