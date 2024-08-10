import { Router } from "express";
import { SupplyCategoryController } from "../controllers/SupplyCategoryController";

const router = Router();


// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", (req, res) => SupplyCategoryController.getAllSupplyCategories(req, res));

export default router;
