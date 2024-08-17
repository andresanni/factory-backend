import { SupplyRepository } from "../SupplyRepository";
import { testDataSource } from "../../../config/data-source";
import { Supply } from "../../entities/Supply";
import { RepositoryError } from "../../errors/RepositoryError";
import { SupplyCategory } from "../../entities/SupplyCategory";

describe("SupplyRepository", () => {
  let repository: SupplyRepository;
  let category1: SupplyCategory;
  let category2: SupplyCategory;
  let supply1: Supply;
  let supply2: Supply;

  beforeAll(async () => {
    await testDataSource.initialize();
    repository = new SupplyRepository(testDataSource);
  });

  afterAll(async () => {
    await testDataSource.destroy();
  });

  beforeEach(async () => {
    await testDataSource.synchronize(true);

    category1 = new SupplyCategory("Test Category 1");
    category2 = new SupplyCategory("Test Category 2");

    supply1 = new Supply("Test Supply 1", category1);
    supply2 = new Supply("Test Supply 2", category2);

    await testDataSource
      .getRepository(SupplyCategory)
      .save([category1, category2]);
    await testDataSource.getRepository(Supply).save([supply1, supply2]);
  });

  describe("find", () => {
    it("should return all supplies", async () => {
      const result = await repository.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Test Supply 1");
      expect(result[1].name).toBe("Test Supply 2");
    });

    it("should return correct supply by id", async () => {
      const result = await repository.findById(2);
      expect(result).toEqual({
        id: 2,
        name: "Test Supply 2",
        category: { id: 2, name: "Test Category 2" },
      });
    });
    it("should throw Repository Error on database error", async () => {
      await testDataSource.query("DROP TABLE supply;");
      await expect(repository.findAll()).rejects.toThrow(RepositoryError);
      await expect(repository.findById(1)).rejects.toThrow(RepositoryError);
    });
  });

  describe("save", () => {
    it("should save a valid supply", async () => {
      const supply3 = new Supply("Test Supply 3", category1);
      const supply4 = new Supply("Test Supply 4", category2);

      const lengthBefore = (await testDataSource.getRepository(Supply).find())
        .length;

      await repository.save(supply3);
      await repository.save(supply4);

      const lengthAfter = (await testDataSource.getRepository(Supply).find())
        .length;

      const supply3FromDb = await testDataSource
        .getRepository(Supply)
        .findOneBy({ id: 3 });
      const supply4FromDb = await testDataSource
        .getRepository(Supply)
        .findOneBy({ id: 4 });

      expect(supply3FromDb).toEqual({ ...supply3, id: 3 });
      expect(supply4FromDb).toEqual({ ...supply4, id: 4 });
      expect(lengthBefore).toBe(lengthAfter - 2);
    });

    it("should throw Repository Error when object is not a Supply", async () => {
      const invalidSupply = {
        name: "Invalid Supply",
        category: "Invalid Category",
      };
      await expect(repository.save(invalidSupply as any)).rejects.toThrow(
        RepositoryError
      );
    });
  });

  describe("update", () => {
    it("should update a valid supply", async () => {
      const modifiedSupply1 = new Supply("Test Supply 1", category2);
      await repository.update(1, modifiedSupply1);
      const updatedSupply1 = await testDataSource
        .getRepository(Supply)
        .findOneBy({ id: 1 });
      expect(updatedSupply1).toEqual({ ...modifiedSupply1, id: 1 });
    });

    it("should return null when updating a non-existing supply", async () => {
      const modifiedSupply1 = new Supply("Test Supply 1", category2);
      const result = await repository.update(3, modifiedSupply1);
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete supply with valid id", async () => {
      const lengthBefore = (await testDataSource.getRepository(Supply).find())
        .length;
      const result = await repository.delete(1);
      const lengthAfter = (await testDataSource.getRepository(Supply).find())
        .length;

      expect(result).toBe(true);
      expect(lengthAfter).toBe(lengthBefore - 1);
    });
    it("should return false with non-existing supply id", async () => {
      const result = await repository.delete(9);
      expect(result).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should throw a RepositoryError with correct attributes when save fails", async () => {
      const invalidSupply = {
        name: "Invalid Supply",
        category: "Invalid Category",
      };

      try {
        await repository.save(invalidSupply as any);
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);
        if (error instanceof RepositoryError) {
          expect(error.internalDetails).toBe(
            "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"
          );
          expect(error.statusCode).toBe(500);
          expect(error.responseMessage).toBe("Error saving supply");
        }
      }
    });

    it("should throw a RepositoryError with correct attributes when find fails", async () => {
      await testDataSource.query("DROP TABLE supply;");

      try {
        await repository.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);
        if (error instanceof RepositoryError) {
          expect(error.responseMessage).toBe("Error fetching supplies");
          expect(error.statusCode).toBe(500);
          expect(error.internalDetails).toContain("SQLITE_ERROR");
        }
      }
    });
  });
});
