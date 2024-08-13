import { Router, Request, Response } from "express";
import { SupplyCategoryController } from "../controllers/SupplyCategoryController";
import { appDataSource } from "../data-source";

const router = Router();

const supplyCategoryController = new SupplyCategoryController(appDataSource);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", async (req: Request, res: Response) => {
  await supplyCategoryController.getAll(req, res);
});

export default router;