import { Request, Response } from "express";
import { SupplyRepository } from "../repositories/SupplyRepository";
import { DataSource } from "typeorm";
import { ICrudController } from "./ICrudController";

export class SupplyController implements ICrudController {
  private supplyRepository: SupplyRepository;

  constructor(dataSource: DataSource) {
    this.supplyRepository = new SupplyRepository(dataSource);
  }
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const supplies = await this.supplyRepository.findAll();
      res.json(supplies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching supplies", error });
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
