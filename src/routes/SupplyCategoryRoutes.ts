import { Router } from "express";
import { SupplyCategoryController } from "../controllers/SupplyCategoryController";

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method
router.get("/", SupplyCategoryController.getAllSupplyCategories);

export default router;
