import { Router, Request, Response } from "express";
import { SupplyController } from "../controllers/SupplyController";
import { appDataSource } from "../../config/data-source";

const router = Router();

const supplyController = new SupplyController(appDataSource);

router.get("/", async (req: Request, res: Response) => {
  await supplyController.getAll(req, res);
});

export default router;
