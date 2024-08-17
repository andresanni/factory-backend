import { Request, Response } from "express";
import { SupplyCategoryRepository } from "../repositories/SupplyCategoryRepository";
import { DataSource } from "typeorm";
import { ICrudController } from "./ICrudController";

export class SupplyCategoryController implements ICrudController {
  private supplyCategoryRepository: SupplyCategoryRepository;

  constructor(dataSource: DataSource) {
    this.supplyCategoryRepository = new SupplyCategoryRepository(dataSource);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const supplyCategories = await this.supplyCategoryRepository.findAll();
      res.json(supplyCategories);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching supply categories", error });
    }
  }
  //TODO
  getById(_req: Request, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  //TODO
  create(_req: Request, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  //TODO
  update(_req: Request, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  //TODO
  delete(_req: Request, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
