import { Request, Response } from "express";
import { SupplyRepository } from "../repository/SupplyRepository";
import { DataSource } from "typeorm";

export class SupplyController {
  
  private supplyRepository : SupplyRepository;

  constructor(dataSource : DataSource){
    this.supplyRepository = new SupplyRepository(dataSource);
  }
  
  async getAllSupplies(req: Request, res: Response): Promise<void> {
    try {
      const supplies = await this.supplyRepository.findAll();
      res.json(supplies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching supplies", error });
    }
  }
}
