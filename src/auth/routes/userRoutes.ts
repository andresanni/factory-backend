import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { authDataSource } from "../../config/data-source";
import { User } from "../entities/User";

const router = Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, name, surname } = req.body;

    try {
      const userRepository = authDataSource.getRepository(User);

      const existingUser = await userRepository.findOneBy({ username });

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User(username, hashedPassword, email, name, surname);
      await userRepository.save(user);

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
