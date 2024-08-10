import { Router, Request, Response } from "express";
import { SupplyController } from "../controllers/SupplyController";
import { AppDataSource } from "../data-source";

const router = Router();

const supplyController = new SupplyController(AppDataSource);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", async (req: Request, res: Response) => {
  await supplyController.getAllSupplies(req, res);
});

export default router;
