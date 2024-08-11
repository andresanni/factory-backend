import { Request, Response } from "express";
import { SupplyCategoryRepository } from "../repository/SupplyCategoryRepository";
import { DataSource } from "typeorm";

export class SupplyCategoryController {
  
  private supplyCategoryRepository : SupplyCategoryRepository;

  constructor(dataSource : DataSource){
    this.supplyCategoryRepository = new SupplyCategoryRepository(dataSource);
  }
  
  async getAllSupplies(req: Request, res: Response): Promise<void> {
    try {
      const supplyCategories = await this.supplyCategoryRepository.findAll();
      res.json(supplyCategories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching supply categories", error });
    }
  }
}