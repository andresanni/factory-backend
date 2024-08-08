import { Request, Response } from "express";
import { SupplyRepository } from "../repository/SupplyRepository";

const supplyRepository = new SupplyRepository();

export class SupplyController {
  static async getAllSupplies(req: Request, res: Response): Promise<void> {
    try {
      const supplies = await supplyRepository.findAll();
      res.json(supplies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching supplies", error });
    }
  }
}
