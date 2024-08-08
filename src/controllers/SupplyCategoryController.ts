import { SupplyCategoryRepository } from "../repository/SupplyCategoryRepository";
import { Request, Response } from "express";

const supplyCategoryRepository = new SupplyCategoryRepository();

export class SupplyCategoryController {
  static async getAllSupplyCategories(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const supplyCategories = await supplyCategoryRepository.findAll();
      res.json(supplyCategories);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching supply categories", error });
    }
  }
}
