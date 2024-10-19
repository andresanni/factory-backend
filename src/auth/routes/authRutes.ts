import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { authDataSource } from "../../config/data-source";
import { NextFunction } from "express";
import { RoleRepository } from "../repositories/RoleRepository";
import { handleError } from "../../utils/errorHandlerUtil";
import { AppError, ErrorLayer } from "../../errors/AppError";

const router = Router();
const userRepository = new UserRepository(authDataSource);
const roleRepository = new RoleRepository(authDataSource);
const authService = new AuthService(userRepository, roleRepository);

router.post(
  "/login",
  [
    body("username").isString().withMessage("Username must be a string"),
    body("password").isString().withMessage("Password must be a string"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        throw new Error("Invalid input in request body"); //Error candidate 1
      }
      const { username, password } = req.body;

      const token = await authService.login(username, password); //Error candidate 2
      res.json({ token });
    } catch (error) {
      if (error instanceof AppError) {
        //Handled error in lower layers, can call error middleware
        return next(error);
      }
      handleError(
        "logging in",
        "login()",
        error,
        500,
        ErrorLayer.ROUTE,
        "authRoutes",
        {
          publicMessage: "Error logging in",
        }
      );
    }
  }
);

export default router;
