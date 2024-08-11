import { Router, Request, Response } from "express";
import { SupplyCategoryController } from "../controllers/SupplyCategoryController";
import { AppDataSource } from "../data-source";

const router = Router();

const supplyCategoryController = new SupplyCategoryController(AppDataSource);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", async (req: Request, res: Response) => {
  await supplyCategoryController.getAll(req, res);
});

export default router;