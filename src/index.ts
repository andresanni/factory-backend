import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import { authDataSource } from "./config/data-source";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./auth/routes/authRutes";
import userRoutes from "./auth/routes/userRoutes";
import morganMiddleware from "./middleware/morganMiddleware";
import logger from "./utils/logger";
//import { insertInitialData } from "./utils/initialData";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morganMiddleware);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

authDataSource
  .initialize()
  .then(() => {
    logger.info("Conected to database");
    app.listen(PORT, () => {
      logger.info(`Server running at port ${PORT}`, {
        operation: "server",
        method: "listen",
      });
    });
    //insertInitialData();
  })
  .catch((error) => {
    logger.error("Error connecting to database", error);
  });
