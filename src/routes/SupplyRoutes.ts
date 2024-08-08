import { Router } from "express";
import { SupplyController } from "../controllers/SupplyController";

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method
router.get("/", SupplyController.getAllSupplies);

export default router;
